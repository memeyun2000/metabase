(ns metabase.oauth.ecology
  ""
  (:require
    [cheshire.core :as json]
    [clj-http.client :as http]
    [metabase.api.common :as api]
    [clojure.string :as str]
    ))


(defn authorize
  "Get eoclogy authorize with params: client_id and redirect_uri"
  [url, clientId, redirectUri]
  (let [_path "/sso/oauth2.0/authorize"]
    (str url _path "?client_id=" clientId "&redirect_uri=" redirectUri "&response_type=code"))
  )


(defn get-token
  "Get token with params: ticket"
  [url, clientId, clientSecret, redirectUri, ticket]
  (let [_path "/sso/oauth2.0/accessToken"]
    (str url _path
         (format "?client_id=%s&client_secret=%s&grant_type=authorization_code&code=%s&redirect_uri=%s"
                 clientId clientSecret ticket redirectUri)
         )
    )
  )

(defn get-user-info
  "get user info params: accessToken"
  [url, accessToken]
  (let [path "/sso/oauth2.0/profile"]
    (str url path (format "?access_token=%s" accessToken))
    )
  )
