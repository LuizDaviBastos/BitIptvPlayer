import { FirebaseApp } from "angularfire2";

export interface IFireBaseService{
   /**
         * Gets the {@link firebase.auth.Auth `Auth`} service for the current app.
         *
         * @example
         * ```javascript
         * var auth = app.auth();
         * // The above is shorthand for:
         * // var auth = firebase.auth(app);
         * ```
         */
    auth(): firebase.auth.Auth;
    /**
     * Gets the {@link firebase.database.Database `Database`} service for the
     * current app.
     *
     * @example
     * ```javascript
     * var database = app.database();
     * // The above is shorthand for:
     * // var database = firebase.database(app);
     * ```
     */
    database(url?: string): firebase.database.Database;
    /**
     * Renders this app unusable and frees the resources of all associated
     * services.
     *
     * @example
     * ```javascript
     * app.delete()
     *   .then(function() {
     *     console.log("App deleted successfully");
     *   })
     *   .catch(function(error) {
     *     console.log("Error deleting app:", error);
     *   });
     * ```
     */
    delete(): Promise<any>;
    /**
     * Gets the {@link firebase.installations.Installations `Installations`} service for the
     * current app.
     *
     * @webonly
     *
     * @example
     * ```javascript
     * const installations = app.installations();
     * // The above is shorthand for:
     * // const installations = firebase.installations(app);
     * ```
     */
    installations(): firebase.installations.Installations;
    /**
     * Gets the {@link firebase.messaging.Messaging `Messaging`} service for the
     * current app.
     *
     * @webonly
     *
     * @example
     * ```javascript
     * var messaging = app.messaging();
     * // The above is shorthand for:
     * // var messaging = firebase.messaging(app);
     * ```
     */
    messaging(): firebase.messaging.Messaging;
    /**
     * The (read-only) name for this app.
     *
     * The default app's name is `"[DEFAULT]"`.
     *
     * @example
     * ```javascript
     * // The default app's name is "[DEFAULT]"
     * firebase.initializeApp(defaultAppConfig);
     * console.log(firebase.app().name);  // "[DEFAULT]"
     * ```
     *
     * @example
     * ```javascript
     * // A named app's name is what you provide to initializeApp()
     * var otherApp = firebase.initializeApp(otherAppConfig, "other");
     * console.log(otherApp.name);  // "other"
     * ```
     */
    name: string;
    /**
     * The (read-only) configuration options for this app. These are the original
     * parameters given in
     * {@link firebase.initializeApp `firebase.initializeApp()`}.
     *
     * @example
     * ```javascript
     * var app = firebase.initializeApp(config);
     * console.log(app.options.databaseURL === config.databaseURL);  // true
     * ```
     */
    options: Object;
    /**
     * Gets the {@link firebase.storage.Storage `Storage`} service for the current
     * app, optionally initialized with a custom storage bucket.
     *
     * @webonly
     *
     * @example
     * ```javascript
     * var storage = app.storage();
     * // The above is shorthand for:
     * // var storage = firebase.storage(app);
     * ```
     *
     * @example
     * ```javascript
     * var storage = app.storage("gs://your-app.appspot.com");
     * ```
     *
     * @param url The gs:// url to your Firebase Storage Bucket.
     *     If not passed, uses the app's default Storage Bucket.
     */
    storage(url?: string): firebase.storage.Storage;
    firestore(): firebase.firestore.Firestore;
    functions(region?: string): firebase.functions.Functions;
    /**
     * Gets the {@link firebase.performance.Performance `Performance`} service for the
     * current app. If the current app is not the default one, throws an error.
     *
     * @webonly
     *
     * @example
     * ```javascript
     * const perf = app.performance();
     * // The above is shorthand for:
     * // const perf = firebase.performance(app);
     * ```
     */
    performance(): firebase.performance.Performance;
    /**
     * Gets the {@link firebase.remoteConfig.RemoteConfig `RemoteConfig`} instance.
     *
     * @webonly
     *
     * @example
     * ```javascript
     * const rc = app.remoteConfig();
     * // The above is shorthand for:
     * // const rc = firebase.remoteConfig(app);
     * ```
     */
    remoteConfig(): firebase.remoteConfig.RemoteConfig;
    /**
     * Gets the {@link firebase.analytics.Analytics `Analytics`} service for the
     * current app. If the current app is not the default one, throws an error.
     *
     * @webonly
     *
     * @example
     * ```javascript
     * const analytics = app.analytics();
     * // The above is shorthand for:
     * // const analytics = firebase.analytics(app);
     * ```
     */
    analytics(): firebase.analytics.Analytics;
}