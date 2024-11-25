(ns metabase.oauth.ecology_test
   (:require
     [clojure.java.classpath :as classpath]
     [clojure.string :as str]
     [clojure.test :refer :all]
     [clojure.tools.namespace.find :as ns.find]
     [metabase.util.encryption :as encryption]
     [metabase.oauth.ecology :as ecology]))

(deftest ^:parallel get-user-info-test
  (ecology/get-user-info "http://moa.msre.com.cn:8010" "TGT-2-QQbe3iHQJeXYx13daRnKRxMYh4HucodEmFlxwiSCpua2hMSxXB-c01"))

(deftest ^:parallel get-token-test
  (ecology/get-token "http://moa.msre.com.cn:8010" "" "" "" ""))

(deftest ^:parallel authorize
  (ecology/authorize "http://moa.msre.com.cn:8010", "bedd9f20-d777-481a-996c-99d42795cb31", "http://192.168.8.190:8080/IESSPortal/SSO")
  )

(deftest ^:parallel encryption-key-test
  (println (encryption/secret-key->hash "hello"))
  )

(deftest ^:parallel encryption-test
  (println (encryption/encrypt (encryption/secret-key->hash "sec") "hello"))
  )

(deftest ^:parallel decrypt-test
  (println (encryption/decrypt (encryption/secret-key->hash "sec") "4L5BigdasY12+CNQWcJY/lEaywdWcAoprs28Apz2PjljzHIfXZ5QY/ySXLyzTSwtYpy/UihZdoeRP/qSdwAOfg=="))
  )
