# -*- coding: utf-8 -*-
import logging
import unicodedata

import requests

from mozilla_django_oidc.auth import OIDCAuthenticationBackend

from django.core.exceptions import SuspiciousOperation
from requests.auth import HTTPBasicAuth

logger = logging.getLogger(__name__)


class GFBioAuthenticationBackend(OIDCAuthenticationBackend):
    def __init__(self):
        super(GFBioAuthenticationBackend, self).__init__()
        self.OIDC_OP_ISSUER = self.get_settings("OIDC_OP_ISSUER")

    def verify_claims(self, claims):
        verified = super(GFBioAuthenticationBackend, self).verify_claims(claims)
        logger.info(
            "GFBioAuthenticationBackend | verify_claims | email={0}  | "
            "verified={1}".format(claims.get("email", "NO_EMAIL_IN_CLAIM"), verified)
        )
        return verified

    def get_username(self, claims):
        username = claims.get("email")

        logger.info(
            "GFBioAuthenticationBackend | get_username | username={0}  | "
            "".format(username)
        )
        return unicodedata.normalize("NFKC", username)[:150]

    def create_user(self, claims):
        logger.info(
            "GFBioAuthenticationBackend | create_user | claims={0}  | "
            "".format(claims)
        )
        user = super(GFBioAuthenticationBackend, self).create_user(claims)

        user.first_name = claims.get("given_name", "")
        user.last_name = claims.get("family_name", "")
        user.name = "{0} {1}".format(
            claims.get("given_name", ""), claims.get("family_name", "")
        ).strip()
        user.email = claims.get("email", "")

        user.update_or_create_external_user_id(
            external_id=claims.get("goe_id", ""), provider="goe_id"
        )
        user.agreed_to_terms = True
        user.agreed_to_privacy = True
        user.save()

        logger.info(
            "GFBioAuthenticationBackend | create_user | user={0} | "
            "external_user_id={1} (goesternid) |"
            "".format(user, user.externaluserid_set.filter(provider="goe_id").first())
        )

        logger.info(
            "GFBioAuthenticationBackend | create_user | email={0}  | "
            "external_user_id={1} (goesternid)".format(
                claims.get("email", "NO_EMAIL_IN_CLAIM"),
                claims.get("external_user_id", "NO_GOESTERNID_IN_CLAIM"),
            )
        )
        return user

    def update_user(self, user, claims):
        logger.info(
            "GFBioAuthenticationBackend | update_user | claims={0}  | user={1}"
            "".format(claims, user)
        )
        user.first_name = claims.get("given_name", "")
        user.last_name = claims.get("family_name", "")
        user.name = "{0} {1}".format(
            claims.get("given_name", ""), claims.get("family_name", "")
        ).strip()
        user.email = claims.get("email", "")
        user.username = self.get_username(claims)
        # user.external_user_id = claims.get('goe_id', '')
        user.update_or_create_external_user_id(
            external_id=claims.get("goe_id", ""), provider="goe_id"
        )

        user.agreed_to_terms = True
        user.agreed_to_privacy = True

        user.save()
        logger.info(
            "GFBioAuthenticationBackend | update_user | email={0}  | "
            "".format(claims.get("email", "NO_EMAIL_IN_CLAIM"))
        )
        return user
    
    def authenticate(self, request, **kwargs):
        """Authenticates a user based on the OIDC code flow."""

        self.request = request
        if not self.request:
            return None

        iss = self.request.GET.get("iss")
        
        if iss and iss != self.OIDC_OP_ISSUER:
            return None

        return super(GFBioAuthenticationBackend, self).authenticate(request, **kwargs)


class Login4BioAuthenticationBackend(OIDCAuthenticationBackend):
    @staticmethod
    def get_settings(attr, *args):
        return OIDCAuthenticationBackend.get_settings(attr.replace("OIDC_", "OIDC_4BIO_"), *args)
    
    def __init__(self):
        super(Login4BioAuthenticationBackend, self).__init__()
        self.OIDC_OP_ISSUER = self.get_settings("OIDC_OP_ISSUER")

    def verify_claims(self, claims):
        verified = super(Login4BioAuthenticationBackend, self).verify_claims(claims)
        logger.info(
            "Login4BioAuthenticationBackend | verify_claims | email={0}  | "
            "verified={1}".format(claims.get("email", "NO_EMAIL_IN_CLAIM"), verified)
        )
        return verified

    def get_username(self, claims):
        username = claims.get("email")

        logger.info(
            "Login4BioAuthenticationBackend | get_username | username={0}  | "
            "".format(username)
        )
        return unicodedata.normalize("NFKC", username)[:150]

    def create_user(self, claims):
        logger.info(
            "Login4BioAuthenticationBackend | create_user | claims={0}  | "
            "".format(claims)
        )
        user = super(Login4BioAuthenticationBackend, self).create_user(claims)

        user.first_name = claims.get("given_name", "")
        user.last_name = claims.get("family_name", "")
        user.name = "{0} {1}".format(
            claims.get("given_name", ""), claims.get("family_name", "")
        ).strip()
        user.email = claims.get("email", "")

        user.update_or_create_external_user_id(
            external_id=claims.get("goe_id", ""), provider="goe_id"
        )
        user.agreed_to_terms = True
        user.agreed_to_privacy = True
        user.save()

        logger.info(
            "Login4BioAuthenticationBackend | create_user | user={0} | "
            "external_user_id={1} (goesternid) |"
            "".format(user, user.externaluserid_set.filter(provider="goe_id").first())
        )

        logger.info(
            "Login4BioAuthenticationBackend | create_user | email={0}  | "
            "external_user_id={1} (goesternid)".format(
                claims.get("email", "NO_EMAIL_IN_CLAIM"),
                claims.get("external_user_id", "NO_GOESTERNID_IN_CLAIM"),
            )
        )
        return user

    def update_user(self, user, claims):
        logger.info(
            "Login4BioAuthenticationBackend | update_user | claims={0}  | user={1}"
            "".format(claims, user)
        )
        user.first_name = claims.get("given_name", "")
        user.last_name = claims.get("family_name", "")
        user.name = "{0} {1}".format(
            claims.get("given_name", ""), claims.get("family_name", "")
        ).strip()
        user.email = claims.get("email", "")
        user.username = self.get_username(claims)
        # user.external_user_id = claims.get('goe_id', '')
        user.update_or_create_external_user_id(
            external_id=claims.get("goe_id", ""), provider="goe_id"
        )

        user.agreed_to_terms = True
        user.agreed_to_privacy = True

        user.save()
        logger.info(
            "Login4BioAuthenticationBackend | update_user | email={0}  | "
            "".format(claims.get("email", "NO_EMAIL_IN_CLAIM"))
        )
        return user

    def authenticate(self, request, **kwargs):
        """Authenticates a user based on the OIDC code flow."""

        self.request = request
        if not self.request:
            return None

        state = self.request.GET.get("state")
        code = self.request.GET.get("code")
        iss = self.request.GET.get("iss")
        nonce = kwargs.pop("nonce", None)
        code_verifier = kwargs.pop("code_verifier", None)

        if not code or not state or not iss:
            return None
        
        if iss != self.OIDC_OP_ISSUER:
            return None

        oidc_authentication_callback = self.get_settings(
            "OIDC_AUTHENTICATION_CALLBACK_URL", "oidc_authentication_callback"
        )

        token_payload = {
            "client_id": self.OIDC_RP_CLIENT_ID,
            "client_secret": self.OIDC_RP_CLIENT_SECRET,
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": oidc_authentication_callback,
        }

        # Send code_verifier with token request if using PKCE
        if code_verifier is not None:
            token_payload.update({"code_verifier": code_verifier})

        # Get the token
        token_info = self.get_token(token_payload)
        id_token = token_info.get("id_token")
        access_token = token_info.get("access_token")

        # Validate the token
        payload = self.verify_token(id_token, nonce=nonce)

        if payload:
            self.store_tokens(access_token, id_token)
            try:
                return self.get_or_create_user(access_token, id_token, payload)
            except SuspiciousOperation as exc:
                logger.warning("failed to get or create user: %s", exc)
                return None

        return None

    def get_token(self, payload):
        """Return token object as a dictionary."""

        auth = None
        if self.get_settings("OIDC_TOKEN_USE_BASIC_AUTH", False):
            # When Basic auth is defined, create the Auth Header and remove secret from payload.
            user = payload.get("client_id")
            pw = payload.get("client_secret")

            auth = HTTPBasicAuth(user, pw)
            del payload["client_secret"]
        
        response = requests.post(
            self.OIDC_OP_TOKEN_ENDPOINT,
            data=payload,
            auth=auth,
            verify=self.get_settings("OIDC_VERIFY_SSL", True),
            timeout=self.get_settings("OIDC_TIMEOUT", None),
            proxies=self.get_settings("OIDC_PROXY", None),
        )
        self.raise_token_response_error(response)
        return response.json()