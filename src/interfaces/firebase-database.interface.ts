interface IFirebaseDataBase {
    /**
     * The {@link firebase.app.App app} associated with the `Database` service
     * instance.
     *
     * @example
     * ```javascript
     * var app = database.app;
     * ```
     */
    app: firebase.app.App;
    /**
     * Disconnects from the server (all Database operations will be completed
     * offline).
     *
     * The client automatically maintains a persistent connection to the Database
     * server, which will remain active indefinitely and reconnect when
     * disconnected. However, the `goOffline()` and `goOnline()` methods may be used
     * to control the client connection in cases where a persistent connection is
     * undesirable.
     *
     * While offline, the client will no longer receive data updates from the
     * Database. However, all Database operations performed locally will continue to
     * immediately fire events, allowing your application to continue behaving
     * normally. Additionally, each operation performed locally will automatically
     * be queued and retried upon reconnection to the Database server.
     *
     * To reconnect to the Database and begin receiving remote events, see
     * `goOnline()`.
     *
     * @example
     * ```javascript
     * firebase.database().goOffline();
     * ```
     */
    goOffline(): any;
    /**
     * Reconnects to the server and synchronizes the offline Database state
     * with the server state.
     *
     * This method should be used after disabling the active connection with
     * `goOffline()`. Once reconnected, the client will transmit the proper data
     * and fire the appropriate events so that your client "catches up"
     * automatically.
     *
     * @example
     * ```javascript
     * firebase.database().goOnline();
     * ```
     */
    goOnline(): any;
    /**
     * Returns a `Reference` representing the location in the Database
     * corresponding to the provided path. If no path is provided, the `Reference`
     * will point to the root of the Database.
     *
     * @example
     * ```javascript
     * // Get a reference to the root of the Database
     * var rootRef = firebase.database().ref();
     * ```
     *
     * @example
     * ```javascript
     * // Get a reference to the /users/ada node
     * var adaRef = firebase.database().ref("users/ada");
     * // The above is shorthand for the following operations:
     * //var rootRef = firebase.database().ref();
     * //var adaRef = rootRef.child("users/ada");
     * ```
     *
     * @param path Optional path representing the location the returned
     *   `Reference` will point. If not provided, the returned `Reference` will
     *   point to the root of the Database.
     * @return If a path is provided, a `Reference`
     *   pointing to the provided path. Otherwise, a `Reference` pointing to the
     *   root of the Database.
     */
    ref(path?: string): firebase.database.Reference;
    /**
     * Returns a `Reference` representing the location in the Database
     * corresponding to the provided Firebase URL.
     *
     * An exception is thrown if the URL is not a valid Firebase Database URL or it
     * has a different domain than the current `Database` instance.
     *
     * Note that all query parameters (`orderBy`, `limitToLast`, etc.) are ignored
     * and are not applied to the returned `Reference`.
     *
     * @example
     * ```javascript
     * // Get a reference to the root of the Database
     * var rootRef = firebase.database().ref("https://<DATABASE_NAME>.firebaseio.com");
     * ```
     *
     * @example
     * ```javascript
     * // Get a reference to the /users/ada node
     * var adaRef = firebase.database().ref("https://<DATABASE_NAME>.firebaseio.com/users/ada");
     * ```
     *
     * @param url The Firebase URL at which the returned `Reference` will
     *   point.
     * @return A `Reference` pointing to the provided
     *   Firebase URL.
     */
    refFromURL(url: string): firebase.database.Reference;
  }