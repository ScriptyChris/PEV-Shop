## Modules

<dl>
<dt><a href="#module_Logger">Logger</a></dt>
<dd><p>Custom wrapper for a commonly used global <code>console</code> methods.</p>
</dd>
<dt><a href="#module_Populate">Populate</a></dt>
<dd><p>Populates database with indicated initial data, optionally doing a cleanup beforehand.</p>
</dd>
<dt><a href="#module_Routes">Routes</a></dt>
<dd><p>Encapsulates routing paths and methods (such as helpers and guards).</p>
</dd>
<dt><a href="#module_BodyObserver">BodyObserver</a></dt>
<dd><p>Handles HTML <code>&lt;body&gt;</code> style changes, which affect position of components,
such as <code>ScrollToTop</code> button and <code>ProductComparisonCandidates</code> bar.</p>
</dd>
<dt><a href="#module_HttpService">HttpService</a></dt>
<dd><p>Handles HTTP communication between frontend and backend.</p>
</dd>
<dt><a href="#module_StorageService">StorageService</a></dt>
<dd><p>Handles reading and manipulating browser&#39;s LocalStorage data.</p>
</dd>
<dt><a href="#module_MiddlewareResponseWrapper">MiddlewareResponseWrapper</a></dt>
<dd><p>Custom wrapper to secure consistent usage of a few <a href="https://expressjs.com/en/4x/api.html#res"><code>Express#res</code></a> methods.</p>
</dd>
</dl>

<a name="module_Logger"></a>

## Logger
Custom wrapper for a commonly used global `console` methods.

<a name="module_Logger..getLogger"></a>

### Logger~getLogger(moduleFileName) ⇒ <code>TLogger</code>
Creates a module bound logger, which name will be visually emphased in output logs.

**Kind**: inner method of [<code>Logger</code>](#module_Logger)  

| Param | Type |
| --- | --- |
| moduleFileName | <code>string</code> | 

**Example** *(Log output for &#x60;middleware-index&#x60; module)*  
```js
([Module: middleware-index.js])::  Server is listening on port 3000
```
<a name="module_Populate"></a>

## Populate
Populates database with indicated initial data, optionally doing a cleanup beforehand.

**Example** *(npm usage)*  
```js
> npm run populate-db
```
**Example** *(Manual CLI usage)*  
```js
> cd path/to/this/module
> ts-node populate.ts \
   executedFromCLI=true \
   products__InputPath=path/to/JSON/with/initial/products/data
```

* [Populate](#module_Populate)
    * [~PARAMS](#module_Populate..PARAMS) : <code>enum</code>
    * [~DEFAULT_PARAMS](#module_Populate..DEFAULT_PARAMS) : <code>enum</code>
    * [~executeDBPopulation(shouldCleanupAll)](#module_Populate..executeDBPopulation)

<a name="module_Populate..PARAMS"></a>

### Populate~PARAMS : <code>enum</code>
Maps supported params passed via CLI.

**Kind**: inner enum of [<code>Populate</code>](#module_Populate)  
**Read only**: true  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| EXECUTED_FROM_CLI | <code>string</code> | <code>&quot;executedFromCLI&quot;</code> | 
| CLEAN_ALL_BEFORE | <code>string</code> | <code>&quot;cleanAllBefore&quot;</code> | 
| JSON_FILE_PATH | <code>string</code> | <code>&quot;{\&quot;undefined\&quot;:\&quot;user_roles__InputPath\&quot;}&quot;</code> | 

<a name="module_Populate..DEFAULT_PARAMS"></a>

### Populate~DEFAULT\_PARAMS : <code>enum</code>
Maps default params, which are applied when regarding individual params are not provided via CLI.

**Kind**: inner enum of [<code>Populate</code>](#module_Populate)  
**Read only**: true  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| "PARAMS.CLEAN_ALL_BEFORE" | <code>string</code> | <code>&quot;true&quot;</code> | 
| "PARAMS.JSON_FILE_PATH.PRODUCTS" | <code>string</code> | <code>&quot;./initialData/products.json&quot;</code> | 
| "PARAMS.JSON_FILE_PATH.USERS" | <code>string</code> | <code>&quot;./initialData/users.json&quot;</code> | 
| "PARAMS.JSON_FILE_PATH.USER_ROLES" | <code>string</code> | <code>&quot;./initialData/user_roles.json&quot;</code> | 

<a name="module_Populate..executeDBPopulation"></a>

### Populate~executeDBPopulation(shouldCleanupAll)
Executes database population. May be called from other module or it's automatically called when this script is run from CLI.

**Kind**: inner method of [<code>Populate</code>](#module_Populate)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| shouldCleanupAll | <code>boolean</code> | <code>false</code> | Decides whether do database cleanup. Passing `PARAMS.CLEAN_ALL_BEFORE` via CLI is an alternative way to do cleanup. |

<a name="module_Routes"></a>

## Routes
Encapsulates routing paths and methods (such as helpers and guards).


* [Routes](#module_Routes)
    * _static_
        * [.ROUTES](#module_Routes.ROUTES) : <code>enum</code>
        * [.routeHelpers](#module_Routes.routeHelpers)
        * [.useRoutesGuards(storeService)](#module_Routes.useRoutesGuards)
    * _inner_
        * [~ROUTE_GROUPS](#module_Routes..ROUTE_GROUPS) : <code>enum</code>

<a name="module_Routes.ROUTES"></a>

### Routes.ROUTES : <code>enum</code>
**Kind**: static enum of [<code>Routes</code>](#module_Routes)  
**Extends**: <code>Routes~ROUTE\_GROUPS</code>  
**Read only**: true  
<a name="module_Routes.routeHelpers"></a>

### Routes.routeHelpers
**Kind**: static constant of [<code>Routes</code>](#module_Routes)  
**Read only**: true  
<a name="module_Routes.useRoutesGuards"></a>

### Routes.useRoutesGuards(storeService)
**Kind**: static method of [<code>Routes</code>](#module_Routes)  

| Param | Type |
| --- | --- |
| storeService | <code>TStoreService</code> | 

<a name="module_Routes..ROUTE_GROUPS"></a>

### Routes~ROUTE\_GROUPS : <code>enum</code>
**Kind**: inner enum of [<code>Routes</code>](#module_Routes)  
**Read only**: true  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| ROOT | <code>string</code> | <code>&quot;/&quot;</code> | 
| PAGES | <code>string</code> | <code>&quot;/pages&quot;</code> | 

<a name="module_BodyObserver"></a>

## BodyObserver
Handles HTML `<body>` style changes, which affect position of components,
such as `ScrollToTop` button and `ProductComparisonCandidates` bar.


* [BodyObserver](#module_BodyObserver)
    * [.subscribeToBodyMutations](#module_BodyObserver.subscribeToBodyMutations) ⇒ <code>number</code>
    * [.unSubscribeFromBodyMutations](#module_BodyObserver.unSubscribeFromBodyMutations)

<a name="module_BodyObserver.subscribeToBodyMutations"></a>

### BodyObserver.subscribeToBodyMutations ⇒ <code>number</code>
Subscribes a provided `callback` to `<body>` style mutations.

**Kind**: static constant of [<code>BodyObserver</code>](#module_BodyObserver)  
**Returns**: <code>number</code> - subscriptionID, which lets unsubscribing `callback` later.  

| Param | Type |
| --- | --- |
| callback | <code>TSubscriptionCallback</code> | 

<a name="module_BodyObserver.unSubscribeFromBodyMutations"></a>

### BodyObserver.unSubscribeFromBodyMutations
Unsubscribes previously subscribed `callback` (via it's ID) from `<body>` style mutations.

**Kind**: static constant of [<code>BodyObserver</code>](#module_BodyObserver)  

| Param | Type |
| --- | --- |
| subscriptionID | <code>number</code> | 

<a name="module_HttpService"></a>

## HttpService
Handles HTTP communication between frontend and backend.


* [HttpService](#module_HttpService)
    * _instance_
        * [.addProduct(product)](#module_HttpService+addProduct)
        * [.getProducts(initialSearchParams, customSearchParamsSerialization)](#module_HttpService+getProducts)
        * [.getProductsByNames(nameList)](#module_HttpService+getProductsByNames)
        * [.getProductsByName(name, pagination, getOnlyEssentialData)](#module_HttpService+getProductsByName)
        * [.getProductByUrl(url)](#module_HttpService+getProductByUrl)
        * [.getProductCategories()](#module_HttpService+getProductCategories)
        * [.getProductsSpecifications()](#module_HttpService+getProductsSpecifications)
        * [.modifyProduct(productName, productModifications)](#module_HttpService+modifyProduct)
        * [.addProductReview(productName, productReview)](#module_HttpService+addProductReview)
        * [.deleteProduct(productName)](#module_HttpService+deleteProduct)
        * [.getCurrentUser()](#module_HttpService+getCurrentUser)
        * [.makeOrder(orderDetails)](#module_HttpService+makeOrder)
        * [.loginUser(loginCredentials)](#module_HttpService+loginUser)
        * [.resetPassword(email)](#module_HttpService+resetPassword)
        * [.resendResetPassword(email)](#module_HttpService+resendResetPassword)
        * [.logoutUser()](#module_HttpService+logoutUser)
        * [.logOutUserFromSessions(preseveCurrentSession)](#module_HttpService+logOutUserFromSessions)
        * [.getUserRoles()](#module_HttpService+getUserRoles)
        * [.registerUser(registrationCredentials)](#module_HttpService+registerUser)
        * [.confirmRegistration(token)](#module_HttpService+confirmRegistration)
        * [.resendConfirmRegistration(email)](#module_HttpService+resendConfirmRegistration)
        * [.setNewPassword(newPassword, token)](#module_HttpService+setNewPassword)
        * [.changePassword(password, newPassword)](#module_HttpService+changePassword)
        * [.addProductToObserved(productId)](#module_HttpService+addProductToObserved)
        * [.removeProductFromObserved(productId)](#module_HttpService+removeProductFromObserved)
        * [.removeAllProductsFromObserved()](#module_HttpService+removeAllProductsFromObserved)
        * [.getObservedProducts()](#module_HttpService+getObservedProducts)
    * _static_
        * [.httpServiceSubscriber](#module_HttpService.httpServiceSubscriber)
        * [.CUSTOM_RES_EXT_DICT](#module_HttpService.CUSTOM_RES_EXT_DICT) : <code>Object</code>
    * _inner_
        * [~Ajax](#module_HttpService..Ajax)
        * [~httpServiceSubscriber](#module_HttpService..httpServiceSubscriber) : <code>object</code>
        * [~httpService](#module_HttpService..httpService) ⇐ <code>Ajax</code>

<a name="module_HttpService+addProduct"></a>

### httpService.addProduct(product)
Adds a new product.

**Kind**: instance method of [<code>HttpService</code>](#module_HttpService)  

| Param | Type |
| --- | --- |
| product | <code>IProduct</code> | 

<a name="module_HttpService+getProducts"></a>

### httpService.getProducts(initialSearchParams, customSearchParamsSerialization)
Gets products according to optional constraints like: name, price, pagination etc.

**Kind**: instance method of [<code>HttpService</code>](#module_HttpService)  

| Param | Type | Default |
| --- | --- | --- |
| initialSearchParams | <code>Object</code> |  | 
| customSearchParamsSerialization | <code>boolean</code> | <code>false</code> | 

<a name="module_HttpService+getProductsByNames"></a>

### httpService.getProductsByNames(nameList)
Gets products by list of names - mostly useful for retrieving related products of a single one.

**Kind**: instance method of [<code>HttpService</code>](#module_HttpService)  

| Param | Type |
| --- | --- |
| nameList | <code>Array.&lt;IProduct.name&gt;</code> | 

<a name="module_HttpService+getProductsByName"></a>

### httpService.getProductsByName(name, pagination, getOnlyEssentialData)
Gets products by a single name - mostly useful for search feature.

**Kind**: instance method of [<code>HttpService</code>](#module_HttpService)  

| Param | Type | Default |
| --- | --- | --- |
| name | <code>IProduct.name</code> |  | 
| pagination | <code>TPagination</code> |  | 
| getOnlyEssentialData | <code>boolean</code> | <code>true</code> | 

<a name="module_HttpService+getProductByUrl"></a>

### httpService.getProductByUrl(url)
Gets product by it's URL - mostly useful for retrieving product from browser's address bar.

**Kind**: instance method of [<code>HttpService</code>](#module_HttpService)  

| Param | Type |
| --- | --- |
| url | <code>IProduct.url</code> | 

<a name="module_HttpService+getProductCategories"></a>

### httpService.getProductCategories()
Gets categories of all products.

**Kind**: instance method of [<code>HttpService</code>](#module_HttpService)  
<a name="module_HttpService+getProductsSpecifications"></a>

### httpService.getProductsSpecifications()
Gets technical specifications of all products.

**Kind**: instance method of [<code>HttpService</code>](#module_HttpService)  
<a name="module_HttpService+modifyProduct"></a>

### httpService.modifyProduct(productName, productModifications)
Modifies product.

**Kind**: instance method of [<code>HttpService</code>](#module_HttpService)  

| Param | Type |
| --- | --- |
| productName | <code>IProduct.name</code> | 
| productModifications | <code>IProduct</code> | 

<a name="module_HttpService+addProductReview"></a>

### httpService.addProductReview(productName, productReview)
Adds a new review to chosen product.

**Kind**: instance method of [<code>HttpService</code>](#module_HttpService)  

| Param | Type |
| --- | --- |
| productName | <code>IProduct.name</code> | 
| productReview | <code>Array.&lt;Object&gt;</code> | 

<a name="module_HttpService+deleteProduct"></a>

### httpService.deleteProduct(productName)
Delets a product via it's name.

**Kind**: instance method of [<code>HttpService</code>](#module_HttpService)  

| Param | Type |
| --- | --- |
| productName | <code>IProduct.name</code> | 

<a name="module_HttpService+getCurrentUser"></a>

### httpService.getCurrentUser()
Gets info about currently logged in user via it's ID taken from app's state.

**Kind**: instance method of [<code>HttpService</code>](#module_HttpService)  
<a name="module_HttpService+makeOrder"></a>

### httpService.makeOrder(orderDetails)
Starts the process of making a new purchase according to given order details.

**Kind**: instance method of [<code>HttpService</code>](#module_HttpService)  

| Param | Type |
| --- | --- |
| orderDetails | <code>IOrder</code> | 

<a name="module_HttpService+loginUser"></a>

### httpService.loginUser(loginCredentials)
Logs in user based on their login and password credentials.

**Kind**: instance method of [<code>HttpService</code>](#module_HttpService)  

| Param | Type |
| --- | --- |
| loginCredentials | <code>Object</code> | 

<a name="module_HttpService+resetPassword"></a>

### httpService.resetPassword(email)
Resets user password via it's email.

**Kind**: instance method of [<code>HttpService</code>](#module_HttpService)  

| Param | Type |
| --- | --- |
| email | <code>IUser.email</code> | 

<a name="module_HttpService+resendResetPassword"></a>

### httpService.resendResetPassword(email)
Resends (repeats) resetting user password via it's email.

**Kind**: instance method of [<code>HttpService</code>](#module_HttpService)  

| Param | Type |
| --- | --- |
| email | <code>IUser.email</code> | 

<a name="module_HttpService+logoutUser"></a>

### httpService.logoutUser()
Loggs out user from current session.

**Kind**: instance method of [<code>HttpService</code>](#module_HttpService)  
<a name="module_HttpService+logOutUserFromSessions"></a>

### httpService.logOutUserFromSessions(preseveCurrentSession)
Loggs out user from all sessions; current session can be preserved if `preseveCurrentSession` param is true.

**Kind**: instance method of [<code>HttpService</code>](#module_HttpService)  

| Param | Type | Default |
| --- | --- | --- |
| preseveCurrentSession | <code>boolean</code> | <code>false</code> | 

<a name="module_HttpService+getUserRoles"></a>

### httpService.getUserRoles()
Gets all user roles.

**Kind**: instance method of [<code>HttpService</code>](#module_HttpService)  
<a name="module_HttpService+registerUser"></a>

### httpService.registerUser(registrationCredentials)
Registers a new user according to provided credentials.

**Kind**: instance method of [<code>HttpService</code>](#module_HttpService)  

| Param | Type |
| --- | --- |
| registrationCredentials | <code>TUserRegistrationCredentials</code> | 

<a name="module_HttpService+confirmRegistration"></a>

### httpService.confirmRegistration(token)
Confirms a newly registered user via token received on their email.

**Kind**: instance method of [<code>HttpService</code>](#module_HttpService)  

| Param | Type |
| --- | --- |
| token | <code>IUser.tokens.confirmRegistration</code> | 

<a name="module_HttpService+resendConfirmRegistration"></a>

### httpService.resendConfirmRegistration(email)
Resends registration confirmation email.

**Kind**: instance method of [<code>HttpService</code>](#module_HttpService)  

| Param | Type |
| --- | --- |
| email | <code>IUser.email</code> | 

<a name="module_HttpService+setNewPassword"></a>

### httpService.setNewPassword(newPassword, token)
Sets a new password for user - mostly after reseting password.

**Kind**: instance method of [<code>HttpService</code>](#module_HttpService)  

| Param | Type |
| --- | --- |
| newPassword | <code>IUser.password</code> | 
| token | <code>IUser.tokens.auth</code> | 

<a name="module_HttpService+changePassword"></a>

### httpService.changePassword(password, newPassword)
Changes user's current password to a new one.

**Kind**: instance method of [<code>HttpService</code>](#module_HttpService)  

| Param | Type |
| --- | --- |
| password | <code>IUser.password</code> | 
| newPassword | <code>IUser.password</code> | 

<a name="module_HttpService+addProductToObserved"></a>

### httpService.addProductToObserved(productId)
Adds product to observed by user, so they can more conveniently find it later.

**Kind**: instance method of [<code>HttpService</code>](#module_HttpService)  

| Param | Type |
| --- | --- |
| productId | <code>string</code> | 

<a name="module_HttpService+removeProductFromObserved"></a>

### httpService.removeProductFromObserved(productId)
Removes product from observed by user.

**Kind**: instance method of [<code>HttpService</code>](#module_HttpService)  

| Param | Type |
| --- | --- |
| productId | <code>string</code> | 

<a name="module_HttpService+removeAllProductsFromObserved"></a>

### httpService.removeAllProductsFromObserved()
Removes all products from observed by user.

**Kind**: instance method of [<code>HttpService</code>](#module_HttpService)  
<a name="module_HttpService+getObservedProducts"></a>

### httpService.getObservedProducts()
Retrieves all observed products by user.

**Kind**: instance method of [<code>HttpService</code>](#module_HttpService)  
<a name="module_HttpService.httpServiceSubscriber"></a>

### HttpService.httpServiceSubscriber
**Kind**: static property of [<code>HttpService</code>](#module_HttpService)  
**See**: httpServiceSubscriber  
<a name="module_HttpService.CUSTOM_RES_EXT_DICT"></a>

### HttpService.CUSTOM\_RES\_EXT\_DICT : <code>Object</code>
Recognize HTTP responses kinds

**Kind**: static constant of [<code>HttpService</code>](#module_HttpService)  
<a name="module_HttpService..Ajax"></a>

### HttpService~Ajax
Handles (low level) HTTP actions as:
- setting appropriate headers,
- assembling requests regarding URL, params, payload, etc. according to used HTTP method and backend expectance,
- initially parsing responses,
- initially handling HTTP errors.

**Kind**: inner class of [<code>HttpService</code>](#module_HttpService)  
<a name="module_HttpService..httpServiceSubscriber"></a>

### HttpService~httpServiceSubscriber : <code>object</code>
Keeps track of [httpService](httpService) subscribers, which want to externally hook into any request
that returns certain status.

**Kind**: inner namespace of [<code>HttpService</code>](#module_HttpService)  
<a name="module_HttpService..httpService"></a>

### HttpService~httpService ⇐ <code>Ajax</code>
Intermediates (high level) client actions meant to communicate with backend APIs.

**Kind**: inner constant of [<code>HttpService</code>](#module_HttpService)  
**Extends**: <code>Ajax</code>  
<a name="module_StorageService"></a>

## StorageService
Handles reading and manipulating browser's LocalStorage data.

<a name="module_StorageService..storageService"></a>

### StorageService~storageService : <code>object</code>
Manipulating storage data API for various contexts, such as `UserCart` or `UserAccount`.

**Kind**: inner namespace of [<code>StorageService</code>](#module_StorageService)  
<a name="module_MiddlewareResponseWrapper"></a>

## MiddlewareResponseWrapper
Custom wrapper to secure consistent usage of a few [`Express#res`](https://expressjs.com/en/4x/api.html#res) methods.

<a name="module_MiddlewareResponseWrapper..wrapRes"></a>

### MiddlewareResponseWrapper~wrapRes(res, status, [data]) ⇒ <code>Response</code>
It asserts that used `HTTP_STATUS_CODE` is adequate to provided optional payload shape (regarding it's key/label).

**Kind**: inner method of [<code>MiddlewareResponseWrapper</code>](#module_MiddlewareResponseWrapper)  

| Param | Type |
| --- | --- |
| res | <code>Response</code> | 
| status | <code>HTTP\_STATUS\_CODE</code> | 
| [data] | <code>Object</code> | 

**Example** *(Without payload)*  
```js
wrapRes(res, HTTP_STATUS_CODE.NO_CONTENT);
```
**Example** *(With payload)*  
```js
wrapRes(res, HTTP_STATUS_CODE.OK, { payload: someResourceValue });
wrapRes(res, HTTP_STATUS_CODE.CREATED, { message: 'Resource created!' });
wrapRes(res, HTTP_STATUS_CODE.NOT_FOUND, { error: 'Resource not found!' });
```
