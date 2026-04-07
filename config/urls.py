from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.admin.views.decorators import staff_member_required
from importlib import import_module
from django.urls import include, path
from django.views import defaults as default_views
from django.views.generic import TemplateView
from rdmo.core.views import home, about

try:
    from rest_framework.authtoken.views import obtain_auth_token
except (AttributeError, ImportError):
    from rest_framework import parsers, renderers
    from rest_framework.authtoken.models import Token
    from rest_framework.authtoken.serializers import AuthTokenSerializer
    from rest_framework.permissions import AllowAny
    from rest_framework.response import Response
    from rest_framework.views import APIView

    class ObtainAuthTokenCompat(APIView):
        # Keep endpoint functional without depending on coreapi schema classes.
        throttle_classes = ()
        permission_classes = (AllowAny,)
        parser_classes = (parsers.FormParser, parsers.MultiPartParser, parsers.JSONParser)
        renderer_classes = (renderers.JSONRenderer,)
        serializer_class = AuthTokenSerializer

        def post(self, request, *args, **kwargs):
            serializer = self.serializer_class(
                data=request.data, context={"request": request}
            )
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data["user"]
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key})

    obtain_auth_token = ObtainAuthTokenCompat.as_view()

urlpatterns = [
    # TODO: if the dmp app has to show up on the first page, a redirect is the
    #   most flexible way to achive this.
    # path("", RedirectView.as_view(url='/dmp/create'), name='redirect_to_create_dmp'),
    path("", TemplateView.as_view(template_name="pages/home.html"), name="home"),
    path("faq", TemplateView.as_view(template_name="pages/faq.html"), name="faq"),

    # RDMO -----------
    path("rdmo/", staff_member_required(home), name="home_rdmo"),
    path("rdmo/about/", staff_member_required(about), name="about_rdmo"),
    path("rdmo/", include("rdmo.core.urls")),

    # FIXME: DASS-2203 try to adapt to hardwired urls in rdmo ui
    path('account/', include('rdmo.accounts.urls')),
    path('management/', include('rdmo.management.urls')),
    path('overlays/', include('rdmo.overlays.urls')),
    path('projects/', include('rdmo.projects.urls')),
    path('services/', include('rdmo.services.urls')),
    # path('views/', include('rdmo.views.urls.v1')),

    path("api/v1/", include("rdmo.core.urls.v1")),

    # Django Admin, use {% url 'admin:index' %}
    path(settings.ADMIN_URL, admin.site.urls),

    # User management
    path("users/", include("gfbio_dmpt.users.urls", namespace="users")),
    path("accounts/", include("allauth.urls")),

    # Your stuff: custom urls includes go here
    path("oidc/", include("mozilla_django_oidc.urls")),
    path("dmp/", include("gfbio_dmpt.gfbio_dmpt_form.urls", namespace="dmpt")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

try:
    import_module("rdmo.core.urls.swagger")
except Exception:
    pass
else:
    urlpatterns += [path("api/v1/", include("rdmo.core.urls.swagger"))]

# API URLS
urlpatterns += [
    # API base url
    path("api/", include("config.api_router")),
    # DRF auth token
    path("auth-token/", obtain_auth_token),
]

if settings.DEBUG:
    # This allows the error pages to be debugged during development, just visit
    # these url in browser to see how these error pages look like.
    urlpatterns += [
        path(
            "400/",
            default_views.bad_request,
            kwargs={"exception": Exception("Bad Request!")},
        ),
        path(
            "403/",
            default_views.permission_denied,
            kwargs={"exception": Exception("Permission Denied")},
        ),
        path(
            "404/",
            default_views.page_not_found,
            kwargs={"exception": Exception("Page not Found")},
        ),
        path("500/", default_views.server_error),
    ]
    if "debug_toolbar" in settings.INSTALLED_APPS:
        import debug_toolbar

        urlpatterns = [path("__debug__/", include(debug_toolbar.urls))] + urlpatterns
