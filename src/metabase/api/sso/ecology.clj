(ns metabase.api.sso.ecology
  "/api/sso/ecology endpoints."
  (:require
    [buddy.sign.jwt :as jwt]
    [cheshire.core :as json]
    [clj-http.client :as http]
    [compojure.core :refer [DELETE GET POST PUT]]
    [java-time.api :as t]
    [metabase.server.request.util :as request.u]
    [metabase.api.common :as api]
    [metabase.util.malli.schema :as ms]
    [metabase.oauth.ecology :as ecology]
    [metabase.util.log :as log]
    [metabase.util.encryption :as encryption]
    [ring.util.response :as response]
    ))

(set! *warn-on-reflection* true)

(def ^:private sso_url                                  "http://moa.msre.com.cn:8010")
(def ^:private sso_client_id                            "3d5789b6-484f-4df1-92cd-7789dee4d4e3")
(def ^:private sso_client_secret                        "aGMm4dUqtkPE72VZNzsM1poJ")
(def ^:private sso_redirect_uri                         "http://ehr.msre.com.cn:8010/ehrs/metab/api/sso/ecology/token")
;(def ^:private sso_redirect_uri                         "http://localhost:3000/api/sso/ecology/token")
(def ^:private ^String metabase-oauth-redirect-path     "metabase.OAUTH_REDIRECT_PATH")
(def ^:private ^String metabase-oauth-emplid-encrypt    "metabase.OAUTH_EMPLID_ENCRYPT")

(defn get-cookies
  [request cookie-name]
  (get-in (get request :cookies) [cookie-name :value])
  )

(api/defendpoint GET "/"
                 [fail :as {:keys [body]}]
                 {fail ms/BooleanValue}
                 (println "hello world")
                 (if fail
                   {:status 400
                    :body {:error-code "oops"}}
                   {:status 200
                    :body body})
                 )


(api/defendpoint GET "/hello"
                 [fail :as {:keys [body]}]
                 {fail ms/BooleanValue}
                 (println "hello world")
                 (if fail
                   {:status 400
                    :body {:error-code "oops"}}
                   {:status 200
                    :body body})
                 )

(defn- cookie-options
  [request timeout_seconds]
  (merge {:http-only true
          :path      "/"
          ;; Set the cookie to expire 20 years from now. That should be sufficient
          :expires   (t/format :rfc-1123-date-time (t/plus (t/zoned-date-time) (t/seconds timeout_seconds)))}
         (if (request.u/https? request)
           {:same-site :none, :secure true}
           {:same-site :lax})))
(defn set-cookie
  [request response name value timeout]
  (response/set-cookie response name value (cookie-options request timeout))
  )


(defn data-to-jwt
  [jwt_data]
  (jwt/sign "hello" "123"
            {:max-age 180})
  )
;1. 将最终需要跳转的 path 保存到 cookie
;2. 跳转到 oa authorize
(api/defendpoint GET "/authorize"
                 [fail :as {:keys [body]} redirect_path, :as request]
                 {fail ms/BooleanValue}
                 (let [redirect_uri (ecology/authorize sso_url sso_client_id sso_redirect_uri)]
                   (log/info (format "SSO redirect to authorize: %s" redirect_uri))
                   (log/info (format "SSO redirect to path: %s, and save it to cookie" redirect_path))

                   (let [response {:status 302, :body nil, :headers {"Location" redirect_uri}}]
                     (response/set-cookie response metabase-oauth-redirect-path
                                          redirect_path (cookie-options request 60)))
                   )
                 )


(api/defendpoint GET "/token"
                 [fail :as {:keys [body]} ticket, :as request]
                 {fail ms/BooleanValue}
                 (let [redirect_uri (ecology/get-token sso_url sso_client_id sso_client_secret sso_redirect_uri ticket)
                       access_token (get (json/parse-string (some-> (http/get redirect_uri) :body)) "access_token")
                       empl_redirect_uri (ecology/get-user-info sso_url access_token)
                       emplid (get (get (json/parse-string (some-> (http/get empl_redirect_uri) :body)) "attributes") "workcode")
                       emplid_encrypt (encryption/encrypt (encryption/secret-key->hash "ecology") emplid )
                       response {:status 302
                                 :body nil
                                 :headers {"Location" (get-cookies request metabase-oauth-redirect-path)}}
                       response (set-cookie request response metabase-oauth-emplid-encrypt emplid_encrypt 60)
                       ]
                   response)
                 )

(api/define-routes)
