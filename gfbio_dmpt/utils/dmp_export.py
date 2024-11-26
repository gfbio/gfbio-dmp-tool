import json
import logging
import os
from pathlib import Path
import re
from tempfile import mkstemp

from django.apps import apps
from django.conf import settings
from django.http import HttpResponse, HttpResponseBadRequest
from django.template.loader import get_template
from django.utils.translation import gettext_lazy as _
import pypandoc

log = logging.getLogger(__name__)


def set_export_reference_document(format, context):
    # try to get the view uri from the context
    try:
        view = context["view"]
        view_uri = getattr(view, "uri")
    except (AttributeError, KeyError, TypeError):
        view_uri = None

    refdocs = []

    if format == "odt":
        # append view specific custom refdoc
        try:
            refdocs.append(settings.EXPORT_REFERENCE_ODT_VIEWS[view_uri])
        except KeyError:
            pass

        # append custom refdoc
        if settings.EXPORT_REFERENCE_ODT:
            refdocs.append(settings.EXPORT_REFERENCE_ODT)

    elif format == "docx":
        # append view specific custom refdoc
        try:
            refdocs.append(settings.EXPORT_REFERENCE_DOCX_VIEWS[view_uri])
        except KeyError:
            pass

        # append custom refdoc
        if settings.EXPORT_REFERENCE_DOCX:
            refdocs.append(settings.EXPORT_REFERENCE_DOCX)

    # append the default reference docs
    refdocs.append(
        os.path.join(
            apps.get_app_config("rdmo").path, "share", "reference" + "." + format
        )
    )

    # return the first file in refdocs that actually exists
    for refdoc in refdocs:
        if os.path.isfile(refdoc):
            return refdoc


def get_pandoc_main_version():
    return int(pypandoc.get_pandoc_version().split(".")[0])


def pandoc_version_at_least(required_version):
    required = [int(x) for x in required_version.split(".")]
    installed = [int(x) for x in pypandoc.get_pandoc_version().split(".")]
    for idx, digit in enumerate(installed):
        try:
            req = required[idx]
        except IndexError:
            return True
        else:
            if digit < req:
                return False
            if digit > req:
                return True
    return True


def parse_metadata(html):
    metadata = None
    pattern = re.compile("(<metadata>)(.*)(</metadata>)", re.MULTILINE | re.DOTALL)
    m = re.search(pattern, html)
    if bool(m) is True:
        try:
            metadata = json.loads(m.group(2))
        except json.JSONDecodeError:
            pass
        else:
            html = html.replace(m.group(0), "")
    return metadata, html


def save_metadata(metadata):
    _, tmp_metadata_file = mkstemp(suffix=".json")
    with open(tmp_metadata_file, "w") as f:
        json.dump(metadata, f)
    f = open(tmp_metadata_file)
    log.info("Save metadata file %s %s", tmp_metadata_file, str(metadata))
    return tmp_metadata_file


def render_to_format(request, export_format, title, template_src, context):
    if export_format not in dict(settings.EXPORT_FORMATS):
        return HttpResponseBadRequest(_("This format is not supported."))

    # render the template to a html string
    template = get_template(template_src)
    html = template.render(context)
    metadata, html = parse_metadata(html)

    # remove empty lines
    html = os.linesep.join([line for line in html.splitlines() if line.strip()])

    if export_format == "html":
        # create the response object
        response = HttpResponse(html)

    else:
        pandoc_args = settings.EXPORT_PANDOC_ARGS.get(export_format, [])
        content_disposition = 'attachment; filename="%s.%s"' % (title, export_format)

        if export_format == "pdf":
            content_disposition = 'filename="%s.%s"' % (title, export_format)

        # use reference document for certain file formats
        refdoc = set_export_reference_document(export_format, context)
        if refdoc is not None and export_format in ["docx", "odt"]:
            # check pandoc version (the args changed to version 2)
            if get_pandoc_main_version() == 1:
                pandoc_args.append("--reference-{}={}".format(export_format, refdoc))
            else:
                pandoc_args.append("--reference-doc={}".format(refdoc))

        # add the possible resource-path
        if "resource_path" in context and pandoc_version_at_least("2") is True:
            resource_path = (
                Path(settings.MEDIA_ROOT).joinpath(context["resource_path"]).as_posix()
            )
            pandoc_args.append("--resource-path={}".format(resource_path))

        # create a temporary file
        (tmp_fd, tmp_filename) = mkstemp("." + export_format)

        # add metadata
        tmp_metadata_file = None
        if metadata is not None and pandoc_version_at_least("2.3") is True:
            tmp_metadata_file = save_metadata(metadata)
            pandoc_args.append("--metadata-file=" + tmp_metadata_file)

        template_file = "/static/export_config/template.latex"
        pandoc_args.append("--template=" + template_file)

        # convert the file using pandoc
        log.info("Export %s document using args %s.", export_format, pandoc_args)
        pypandoc.convert_text(
            html,
            export_format,
            format="html",
            outputfile=tmp_filename,
            extra_args=pandoc_args,
        )

        # read the temporary file
        file_handler = os.fdopen(tmp_fd, "rb")
        file_content = file_handler.read()
        file_handler.close()

        # delete temporary files
        if tmp_metadata_file is not None:
            os.remove(tmp_metadata_file)
        os.remove(tmp_filename)

        # create the response object
        response = HttpResponse(
            file_content, content_type="application/%s" % export_format
        )
        response["Content-Disposition"] = content_disposition.encode("utf-8")

    return response
