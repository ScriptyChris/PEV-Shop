fake-pev-shopping

# fake-pev-shopping

## Table of contents

### Modules

- [components/pages/\_routes](#modulescomponents_pages__routesmd)
- [components/utils/bodyObserver](#modulescomponents_utils_bodyobservermd)
- [components/utils/flexibleList](#modulescomponents_utils_flexiblelistmd)
- [components/utils/pagination](#modulescomponents_utils_paginationmd)
- [components/utils/pevElements](#modulescomponents_utils_pevelementsmd)
- [components/utils/popup](#modulescomponents_utils_popupmd)
- [components/utils/ratingWidget](#modulescomponents_utils_ratingwidgetmd)
- [components/utils/scroller](#modulescomponents_utils_scrollermd)
- [contexts/rwd-layout](#modulescontexts_rwd_layoutmd)
- [features/httpService](#modulesfeatures_httpservicemd)
- [features/storageService](#modulesfeatures_storageservicemd)
- [features/storeService](#modulesfeatures_storeservicemd)
- [features/userSessionService](#modulesfeatures_usersessionservicemd)

[fake-pev-shopping](#readmemd) / [components/pages/\_routes](#modulescomponents_pages__routesmd) / [<internal\>](#modulescomponents_pages__routes_internal_md) / StoreService

# Class: StoreService

[components/pages/_routes](#modulescomponents_pages__routesmd).[<internal>](#modulescomponents_pages__routes_internal_md).StoreService

## Table of contents

### Constructors

- [constructor](#constructor)

### Accessors

- [productComparisonState](#productcomparisonstate)
- [userAccountState](#useraccountstate)
- [userCartProducts](#usercartproducts)
- [userCartProductsCount](#usercartproductscount)
- [userCartState](#usercartstate)
- [userCartTotalPrice](#usercarttotalprice)

### Methods

- [addProductToUserCartState](#addproducttousercartstate)
- [clearProductComparisonState](#clearproductcomparisonstate)
- [clearProductObservedState](#clearproductobservedstate)
- [clearUserAccountState](#clearuseraccountstate)
- [clearUserCartState](#clearusercartstate)
- [removeProductFromUserCartState](#removeproductfromusercartstate)
- [replaceUserCartState](#replaceusercartstate)
- [updateProductComparisonState](#updateproductcomparisonstate)
- [updateProductObservedState](#updateproductobservedstate)
- [updateUserAccountState](#updateuseraccountstate)

## Constructors

### constructor

• **new StoreService**()

#### Defined in

[src/frontend/features/storeService.ts:27](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storeService.ts#L27)

## Accessors

### productComparisonState

• `get` **productComparisonState**(): { `_id`: `string` ; `availability`: `number` ; `name`: `string` ; `price`: `number` ; `quantity`: `number`  }[]

#### Returns

{ `_id`: `string` ; `availability`: `number` ; `name`: `string` ; `price`: `number` ; `quantity`: `number`  }[]

#### Defined in

[src/frontend/features/storeService.ts:151](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storeService.ts#L151)

___

### userAccountState

• `get` **userAccountState**(): ``null`` \| [`TUserPublic`](#tuserpublic)

#### Returns

``null`` \| [`TUserPublic`](#tuserpublic)

#### Defined in

[src/frontend/features/storeService.ts:147](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storeService.ts#L147)

___

### userCartProducts

• `get` **userCartProducts**(): { `_id`: `string` ; `availability`: `number` ; `name`: `string` ; `price`: `number` ; `quantity`: `number`  }[]

#### Returns

{ `_id`: `string` ; `availability`: `number` ; `name`: `string` ; `price`: `number` ; `quantity`: `number`  }[]

#### Defined in

[src/frontend/features/storeService.ts:135](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storeService.ts#L135)

___

### userCartProductsCount

• `get` **userCartProductsCount**(): `number`

#### Returns

`number`

#### Defined in

[src/frontend/features/storeService.ts:143](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storeService.ts#L143)

___

### userCartState

• `get` **userCartState**(): [`IUserCart`](#interfacescomponents_pages__routes_internal_iusercartmd)

#### Returns

[`IUserCart`](#interfacescomponents_pages__routes_internal_iusercartmd)

#### Defined in

[src/frontend/features/storeService.ts:131](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storeService.ts#L131)

___

### userCartTotalPrice

• `get` **userCartTotalPrice**(): `number`

#### Returns

`number`

#### Defined in

[src/frontend/features/storeService.ts:139](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storeService.ts#L139)

## Methods

### addProductToUserCartState

▸ **addProductToUserCartState**(`newUserCartState`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `newUserCartState` | `Object` |
| `newUserCartState._id` | `string` |
| `newUserCartState.availability` | `number` |
| `newUserCartState.name` | `string` |
| `newUserCartState.price` | `number` |
| `newUserCartState.quantity` | `number` |

#### Returns

`number`

#### Defined in

[src/frontend/features/storeService.ts:48](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storeService.ts#L48)

___

### clearProductComparisonState

▸ **clearProductComparisonState**(): `void`

#### Returns

`void`

#### Defined in

[src/frontend/features/storeService.ts:119](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storeService.ts#L119)

___

### clearProductObservedState

▸ **clearProductObservedState**(): `void`

#### Returns

`void`

#### Defined in

[src/frontend/features/storeService.ts:127](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storeService.ts#L127)

___

### clearUserAccountState

▸ **clearUserAccountState**(): `void`

#### Returns

`void`

#### Defined in

[src/frontend/features/storeService.ts:43](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storeService.ts#L43)

___

### clearUserCartState

▸ **clearUserCartState**(): `void`

#### Returns

`void`

#### Defined in

[src/frontend/features/storeService.ts:89](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storeService.ts#L89)

___

### removeProductFromUserCartState

▸ **removeProductFromUserCartState**(`newUserCartState`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `newUserCartState` | `Object` |
| `newUserCartState._id` | `string` |
| `newUserCartState.availability` | `number` |
| `newUserCartState.name` | `string` |
| `newUserCartState.price` | `number` |
| `newUserCartState.quantity` | `number` |

#### Returns

`void`

#### Defined in

[src/frontend/features/storeService.ts:69](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storeService.ts#L69)

___

### replaceUserCartState

▸ **replaceUserCartState**(`newUserCartState`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `newUserCartState` | [`IUserCart`](#interfacescomponents_pages__routes_internal_iusercartmd) |

#### Returns

`void`

#### Defined in

[src/frontend/features/storeService.ts:96](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storeService.ts#L96)

___

### updateProductComparisonState

▸ **updateProductComparisonState**(`__namedParameters`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.add` | `Object` |
| `__namedParameters.add._id` | `string` |
| `__namedParameters.add.availability` | `number` |
| `__namedParameters.add.name` | `string` |
| `__namedParameters.add.price` | `number` |
| `__namedParameters.add.quantity` | `number` |
| `__namedParameters.remove` | `Partial`<{ `_id`: `string` ; `index`: `number`  }\> |

#### Returns

`void`

#### Defined in

[src/frontend/features/storeService.ts:102](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storeService.ts#L102)

___

### updateProductObservedState

▸ **updateProductObservedState**(`observedProductsIDs`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `observedProductsIDs` | `undefined` \| `ObjectId`[] |

#### Returns

`void`

#### Defined in

[src/frontend/features/storeService.ts:123](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storeService.ts#L123)

___

### updateUserAccountState

▸ **updateUserAccountState**(`userAccountState`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `userAccountState` | [`TUserPublic`](#tuserpublic) |

#### Returns

`void`

#### Defined in

[src/frontend/features/storeService.ts:39](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storeService.ts#L39)

[fake-pev-shopping](#readmemd) / [features/httpService](#modulesfeatures_httpservicemd) / [<internal\>](#modulesfeatures_httpservice_internal_md) / Ajax

# Class: Ajax

[features/httpService](#modulesfeatures_httpservicemd).[<internal>](#modulesfeatures_httpservice_internal_md).Ajax

Handles (low level) HTTP actions as:
- setting appropriate headers,
- assembling requests regarding URL, params, payload, etc. according to used HTTP method and backend expectance,
- initially parsing responses,
- initially handling HTTP errors.

## Hierarchy

- **`Ajax`**

  ↳ [`HttpService`](#classesfeatures_httpservice_internal_httpservicemd)

[fake-pev-shopping](#readmemd) / [features/httpService](#modulesfeatures_httpservicemd) / [<internal\>](#modulesfeatures_httpservice_internal_md) / HttpService

# Class: HttpService

[features/httpService](#modulesfeatures_httpservicemd).[<internal>](#modulesfeatures_httpservice_internal_md).HttpService

Intermediates (high level) client actions meant to communicate with backend APIs.

## Hierarchy

- [`Ajax`](#classesfeatures_httpservice_internal_ajaxmd)

  ↳ **`HttpService`**

## Table of contents

### Constructors

- [constructor](#constructor)

### Properties

- [URLS](#urls)

### Methods

- [\_getUserId](#_getuserid)
- [\_preparePaginationParams](#_preparepaginationparams)
- [addProduct](#addproduct)
- [addProductReview](#addproductreview)
- [addProductToObserved](#addproducttoobserved)
- [changePassword](#changepassword)
- [confirmRegistration](#confirmregistration)
- [deleteProduct](#deleteproduct)
- [getAllOrders](#getallorders)
- [getCurrentUser](#getcurrentuser)
- [getCurrentUserOrders](#getcurrentuserorders)
- [getObservedProducts](#getobservedproducts)
- [getProductByUrl](#getproductbyurl)
- [getProductCategories](#getproductcategories)
- [getProducts](#getproducts)
- [getProductsById](#getproductsbyid)
- [getProductsByName](#getproductsbyname)
- [getProductsByNames](#getproductsbynames)
- [getProductsSpecifications](#getproductsspecifications)
- [getUserRoles](#getuserroles)
- [logOutUserFromSessions](#logoutuserfromsessions)
- [loginUser](#loginuser)
- [logoutUser](#logoutuser)
- [makeOrder](#makeorder)
- [modifyProduct](#modifyproduct)
- [registerUser](#registeruser)
- [removeAllProductsFromObserved](#removeallproductsfromobserved)
- [removeProductFromObserved](#removeproductfromobserved)
- [resendConfirmRegistration](#resendconfirmregistration)
- [resendResetPassword](#resendresetpassword)
- [resetPassword](#resetpassword)
- [setNewPassword](#setnewpassword)

## Constructors

### constructor

• **new HttpService**()

#### Overrides

Ajax.constructor

#### Defined in

[src/frontend/features/httpService.ts:244](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L244)

## Properties

### URLS

• `Private` **URLS**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `ORDERS` | ``"orders"`` |
| `PRODUCTS` | ``"products"`` |
| `PRODUCTS_SPECS` | ``"products/specs"`` |
| `PRODUCT_CATEGORIES` | ``"productCategories"`` |
| `USERS` | ``"users"`` |
| `USER_ROLES` | ``"user-roles"`` |

#### Defined in

[src/frontend/features/httpService.ts:235](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L235)

## Methods

### \_getUserId

▸ **_getUserId**(): `ObjectId`

#### Returns

`ObjectId`

#### Defined in

[src/frontend/features/httpService.ts:259](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L259)

___

### \_preparePaginationParams

▸ **_preparePaginationParams**(`searchParams`, `pagination?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `searchParams` | `URLSearchParams` |
| `pagination?` | [`TPagination`](#tpagination) |

#### Returns

`void`

#### Defined in

[src/frontend/features/httpService.ts:248](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L248)

___

### addProduct

▸ **addProduct**(`product`): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Adds a new product.

#### Parameters

| Name | Type |
| :------ | :------ |
| `product` | [`IProduct`](#interfacesfeatures_httpservice_internal_iproductmd) |

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:272](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L272)

___

### addProductReview

▸ **addProductReview**(`productUrl`, `productReview`): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Adds a new review to chosen product.

#### Parameters

| Name | Type |
| :------ | :------ |
| `productUrl` | `string` |
| `productReview` | `IReviews` |

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:409](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L409)

___

### addProductToObserved

▸ **addProductToObserved**(`productId`): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Adds product to observed by user, so they can more conveniently find it later.

#### Parameters

| Name | Type |
| :------ | :------ |
| `productId` | `string` |

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:530](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L530)

___

### changePassword

▸ **changePassword**(`password`, `newPassword`): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Changes user's current password to a new one.

#### Parameters

| Name | Type |
| :------ | :------ |
| `password` | `string` |
| `newPassword` | `string` |

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:523](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L523)

___

### confirmRegistration

▸ **confirmRegistration**(`token`): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Confirms a newly registered user via token received on their email.

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | `string` |

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:502](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L502)

___

### deleteProduct

▸ **deleteProduct**(`productUrl`): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Delets a product via it's name.

#### Parameters

| Name | Type |
| :------ | :------ |
| `productUrl` | `string` |

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:416](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L416)

___

### getAllOrders

▸ **getAllOrders**(): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Gets orders of all client users.

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:437](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L437)

___

### getCurrentUser

▸ **getCurrentUser**(): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Gets info about currently logged in user via it's ID taken from app's state.

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:423](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L423)

___

### getCurrentUserOrders

▸ **getCurrentUserOrders**(): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Gets orders of currently logged in client user.

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:430](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L430)

___

### getObservedProducts

▸ **getObservedProducts**(): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Retrieves all observed products by user.

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:551](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L551)

___

### getProductByUrl

▸ **getProductByUrl**(`url`): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Gets product by it's URL - mostly useful for retrieving product from browser's address bar.

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:363](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L363)

___

### getProductCategories

▸ **getProductCategories**(): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Gets categories of all products.

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:379](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L379)

___

### getProducts

▸ **getProducts**(`initialSearchParams`, `customSearchParamsSerialization?`): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Gets products according to optional constraints like: name, price, pagination etc.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `initialSearchParams` | `Partial`<{ `name`: `string` ; `pagination`: [`TPagination`](#tpagination) ; `price`: [`number`, `number`] ; `productCategories`: `string` ; `productTechnicalSpecs`: `string` ; `sortBy`: `string`  }\> | `undefined` |
| `customSearchParamsSerialization` | `boolean` | `false` |

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:279](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L279)

___

### getProductsById

▸ **getProductsById**(`idList`): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\> \| `Promise`<`never`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `idList` | `any`[] |

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\> \| `Promise`<`never`[]\>

#### Defined in

[src/frontend/features/httpService.ts:323](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L323)

___

### getProductsByName

▸ **getProductsByName**(`name`, `pagination`, `getOnlyEssentialData?`): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Gets products by a single name - mostly useful for search feature.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `string` | `undefined` |
| `pagination` | [`TPagination`](#tpagination) | `undefined` |
| `getOnlyEssentialData` | `boolean` | `true` |

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:350](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L350)

___

### getProductsByNames

▸ **getProductsByNames**(`nameList`): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\> \| `Promise`<`never`[]\>

Gets products by list of names - mostly useful for retrieving related products of a single one.

#### Parameters

| Name | Type |
| :------ | :------ |
| `nameList` | `string`[] |

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\> \| `Promise`<`never`[]\>

#### Defined in

[src/frontend/features/httpService.ts:334](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L334)

___

### getProductsSpecifications

▸ **getProductsSpecifications**(): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__EXCEPTION_ALREADY_HANDLED"``\> \| [`TProductTechnicalSpecs`](#tproducttechnicalspecs)\>

Gets technical specifications of all products.

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__EXCEPTION_ALREADY_HANDLED"``\> \| [`TProductTechnicalSpecs`](#tproducttechnicalspecs)\>

#### Defined in

[src/frontend/features/httpService.ts:386](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L386)

___

### getUserRoles

▸ **getUserRoles**(): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Gets all user roles.

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:488](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L488)

___

### logOutUserFromSessions

▸ **logOutUserFromSessions**(`preseveCurrentSession?`): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Loggs out user from all sessions; current session can be preserved if `preseveCurrentSession` param is true.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `preseveCurrentSession` | `boolean` | `false` |

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:481](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L481)

___

### loginUser

▸ **loginUser**(`loginCredentials`): `Promise`<[`TUserPublic`](#tuserpublic) \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Logs in user based on their login and password credentials.

#### Parameters

| Name | Type |
| :------ | :------ |
| `loginCredentials` | `Object` |
| `loginCredentials.login` | `string` |
| `loginCredentials.password` | `string` |

#### Returns

`Promise`<[`TUserPublic`](#tuserpublic) \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:451](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L451)

___

### logoutUser

▸ **logoutUser**(): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Loggs out user from current session.

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:474](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L474)

___

### makeOrder

▸ **makeOrder**(`orderDetails`): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Starts the process of making a new purchase according to given order details.

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderDetails` | [`IOrderPayload`](#interfacesfeatures_httpservice_internal_iorderpayloadmd) |

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:444](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L444)

___

### modifyProduct

▸ **modifyProduct**(`productName`, `productModifications`): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Modifies product.

#### Parameters

| Name | Type |
| :------ | :------ |
| `productName` | `string` |
| `productModifications` | `Partial`<[`IProduct`](#interfacesfeatures_httpservice_internal_iproductmd)\> |

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:395](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L395)

___

### registerUser

▸ **registerUser**(`registrationCredentials`): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Registers a new user according to provided credentials.

#### Parameters

| Name | Type |
| :------ | :------ |
| `registrationCredentials` | [`TUserRegistrationCredentials`](#tuserregistrationcredentials) |

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:495](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L495)

___

### removeAllProductsFromObserved

▸ **removeAllProductsFromObserved**(): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Removes all products from observed by user.

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:544](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L544)

___

### removeProductFromObserved

▸ **removeProductFromObserved**(`productId`): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Removes product from observed by user.

#### Parameters

| Name | Type |
| :------ | :------ |
| `productId` | `string` |

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:537](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L537)

___

### resendConfirmRegistration

▸ **resendConfirmRegistration**(`email`): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Resends registration confirmation email.

#### Parameters

| Name | Type |
| :------ | :------ |
| `email` | `string` |

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:509](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L509)

___

### resendResetPassword

▸ **resendResetPassword**(`email`): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Resends (repeats) resetting user password via it's email.

#### Parameters

| Name | Type |
| :------ | :------ |
| `email` | `string` |

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:467](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L467)

___

### resetPassword

▸ **resetPassword**(`email`): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Resets user password via it's email.

#### Parameters

| Name | Type |
| :------ | :------ |
| `email` | `string` |

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:460](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L460)

___

### setNewPassword

▸ **setNewPassword**(`newPassword`, `token`): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Sets a new password for user - mostly after reseting password.

#### Parameters

| Name | Type |
| :------ | :------ |
| `newPassword` | `string` |
| `token` | `string` |

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:516](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L516)

[fake-pev-shopping](#readmemd) / [features/storageService](#modulesfeatures_storageservicemd) / [<internal\>](#modulesfeatures_storageservice_internal_md) / StorageService

# Class: StorageService

[features/storageService](#modulesfeatures_storageservicemd).[<internal>](#modulesfeatures_storageservice_internal_md).StorageService

## Hierarchy

- **`StorageService`**

  ↳ [`UserCart`](#classesfeatures_storageservice_internal_usercartmd)

  ↳ [`UserAccount`](#classesfeatures_storageservice_internal_useraccountmd)

  ↳ [`UserAuthToken`](#classesfeatures_storageservice_internal_userauthtokenmd)

## Table of contents

### Constructors

- [constructor](#constructor)

### Properties

- [key](#key)

### Methods

- [get](#get)
- [remove](#remove)
- [update](#update)

## Constructors

### constructor

• **new StorageService**(`key`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Defined in

[src/frontend/features/storageService.ts:18](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storageService.ts#L18)

## Properties

### key

• **key**: `string`

#### Defined in

[src/frontend/features/storageService.ts:16](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storageService.ts#L16)

## Methods

### get

▸ **get**(): `any`

#### Returns

`any`

Already parsed (from JSON) stored value.

#### Defined in

[src/frontend/features/storageService.ts:42](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storageService.ts#L42)

___

### remove

▸ **remove**(): `void`

Removes a values.

#### Returns

`void`

#### Defined in

[src/frontend/features/storageService.ts:54](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storageService.ts#L54)

___

### update

▸ **update**(`value`, `checkIfShouldRemove`): `void`

Update regarding storage context by either setting given `value` or removing existing one,
depending on result of calling `checkIfShouldRemove`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`TStorageValue`](#tstoragevalue) |
| `checkIfShouldRemove` | () => `boolean` |

#### Returns

`void`

#### Defined in

[src/frontend/features/storageService.ts:26](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storageService.ts#L26)

[fake-pev-shopping](#readmemd) / [features/storageService](#modulesfeatures_storageservicemd) / [<internal\>](#modulesfeatures_storageservice_internal_md) / UserAccount

# Class: UserAccount

[features/storageService](#modulesfeatures_storageservicemd).[<internal>](#modulesfeatures_storageservice_internal_md).UserAccount

## Hierarchy

- [`StorageService`](#classesfeatures_storageservice_internal_storageservicemd)

  ↳ **`UserAccount`**

## Table of contents

### Constructors

- [constructor](#constructor)

### Properties

- [key](#key)

### Methods

- [get](#get)
- [remove](#remove)
- [update](#update)

## Constructors

### constructor

• **new UserAccount**(`key`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Overrides

[StorageService](#classesfeatures_storageservice_internal_storageservicemd).[constructor](#constructor)

#### Defined in

[src/frontend/features/storageService.ts:70](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storageService.ts#L70)

## Properties

### key

• **key**: `string`

#### Inherited from

[StorageService](#classesfeatures_storageservice_internal_storageservicemd).[key](#key)

#### Defined in

[src/frontend/features/storageService.ts:16](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storageService.ts#L16)

## Methods

### get

▸ **get**(): `any`

#### Returns

`any`

Already parsed (from JSON) stored value.

#### Inherited from

[StorageService](#classesfeatures_storageservice_internal_storageservicemd).[get](#get)

#### Defined in

[src/frontend/features/storageService.ts:42](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storageService.ts#L42)

___

### remove

▸ **remove**(): `void`

Removes a values.

#### Returns

`void`

#### Inherited from

[StorageService](#classesfeatures_storageservice_internal_storageservicemd).[remove](#remove)

#### Defined in

[src/frontend/features/storageService.ts:54](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storageService.ts#L54)

___

### update

▸ **update**(`accountState`): `void`

Update regarding storage context by either setting given `value` or removing existing one,
depending on result of calling `checkIfShouldRemove`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `accountState` | [`TUserPublic`](#tuserpublic) |

#### Returns

`void`

#### Overrides

[StorageService](#classesfeatures_storageservice_internal_storageservicemd).[update](#update)

#### Defined in

[src/frontend/features/storageService.ts:74](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storageService.ts#L74)

[fake-pev-shopping](#readmemd) / [features/storageService](#modulesfeatures_storageservicemd) / [<internal\>](#modulesfeatures_storageservice_internal_md) / UserAuthToken

# Class: UserAuthToken

[features/storageService](#modulesfeatures_storageservicemd).[<internal>](#modulesfeatures_storageservice_internal_md).UserAuthToken

## Hierarchy

- [`StorageService`](#classesfeatures_storageservice_internal_storageservicemd)

  ↳ **`UserAuthToken`**

## Table of contents

### Constructors

- [constructor](#constructor)

### Properties

- [key](#key)

### Methods

- [get](#get)
- [remove](#remove)
- [update](#update)

## Constructors

### constructor

• **new UserAuthToken**(`key`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Overrides

[StorageService](#classesfeatures_storageservice_internal_storageservicemd).[constructor](#constructor)

#### Defined in

[src/frontend/features/storageService.ts:80](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storageService.ts#L80)

## Properties

### key

• **key**: `string`

#### Inherited from

[StorageService](#classesfeatures_storageservice_internal_storageservicemd).[key](#key)

#### Defined in

[src/frontend/features/storageService.ts:16](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storageService.ts#L16)

## Methods

### get

▸ **get**(): `any`

#### Returns

`any`

Already parsed (from JSON) stored value.

#### Inherited from

[StorageService](#classesfeatures_storageservice_internal_storageservicemd).[get](#get)

#### Defined in

[src/frontend/features/storageService.ts:42](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storageService.ts#L42)

___

### remove

▸ **remove**(): `void`

Removes a values.

#### Returns

`void`

#### Inherited from

[StorageService](#classesfeatures_storageservice_internal_storageservicemd).[remove](#remove)

#### Defined in

[src/frontend/features/storageService.ts:54](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storageService.ts#L54)

___

### update

▸ **update**(`authToken`): `void`

Update regarding storage context by either setting given `value` or removing existing one,
depending on result of calling `checkIfShouldRemove`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `authToken` | `string` |

#### Returns

`void`

#### Overrides

[StorageService](#classesfeatures_storageservice_internal_storageservicemd).[update](#update)

#### Defined in

[src/frontend/features/storageService.ts:84](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storageService.ts#L84)

[fake-pev-shopping](#readmemd) / [features/storageService](#modulesfeatures_storageservicemd) / [<internal\>](#modulesfeatures_storageservice_internal_md) / UserCart

# Class: UserCart

[features/storageService](#modulesfeatures_storageservicemd).[<internal>](#modulesfeatures_storageservice_internal_md).UserCart

## Hierarchy

- [`StorageService`](#classesfeatures_storageservice_internal_storageservicemd)

  ↳ **`UserCart`**

## Table of contents

### Constructors

- [constructor](#constructor)

### Properties

- [key](#key)

### Methods

- [get](#get)
- [remove](#remove)
- [update](#update)

## Constructors

### constructor

• **new UserCart**(`key`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Overrides

[StorageService](#classesfeatures_storageservice_internal_storageservicemd).[constructor](#constructor)

#### Defined in

[src/frontend/features/storageService.ts:60](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storageService.ts#L60)

## Properties

### key

• **key**: `string`

#### Inherited from

[StorageService](#classesfeatures_storageservice_internal_storageservicemd).[key](#key)

#### Defined in

[src/frontend/features/storageService.ts:16](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storageService.ts#L16)

## Methods

### get

▸ **get**(): `any`

#### Returns

`any`

Already parsed (from JSON) stored value.

#### Inherited from

[StorageService](#classesfeatures_storageservice_internal_storageservicemd).[get](#get)

#### Defined in

[src/frontend/features/storageService.ts:42](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storageService.ts#L42)

___

### remove

▸ **remove**(): `void`

Removes a values.

#### Returns

`void`

#### Inherited from

[StorageService](#classesfeatures_storageservice_internal_storageservicemd).[remove](#remove)

#### Defined in

[src/frontend/features/storageService.ts:54](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storageService.ts#L54)

___

### update

▸ **update**(`cartState`): `void`

Update regarding storage context by either setting given `value` or removing existing one,
depending on result of calling `checkIfShouldRemove`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `cartState` | [`IUserCart`](#interfacescomponents_pages__routes_internal_iusercartmd) |

#### Returns

`void`

#### Overrides

[StorageService](#classesfeatures_storageservice_internal_storageservicemd).[update](#update)

#### Defined in

[src/frontend/features/storageService.ts:64](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storageService.ts#L64)

[fake-pev-shopping](#readmemd) / [components/pages/\_routes](#modulescomponents_pages__routesmd) / [<internal\>](#modulescomponents_pages__routes_internal_md) / IUserCart

# Interface: IUserCart

[components/pages/_routes](#modulescomponents_pages__routesmd).[<internal>](#modulescomponents_pages__routes_internal_md).IUserCart

## Table of contents

### Properties

- [products](#products)
- [totalCount](#totalcount)
- [totalPrice](#totalprice)

## Properties

### products

• **products**: { `_id`: `string` ; `availability`: `number` ; `name`: `string` ; `price`: `number` ; `quantity`: `number`  }[]

#### Defined in

[commons/types.ts:61](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/commons/types.ts#L61)

___

### totalCount

• **totalCount**: `number`

#### Defined in

[commons/types.ts:68](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/commons/types.ts#L68)

___

### totalPrice

• **totalPrice**: `number`

#### Defined in

[commons/types.ts:69](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/commons/types.ts#L69)

[fake-pev-shopping](#readmemd) / [features/httpService](#modulesfeatures_httpservicemd) / [<internal\>](#modulesfeatures_httpservice_internal_md) / ICustomResExt

# Interface: ICustomResExt

[features/httpService](#modulesfeatures_httpservicemd).[<internal>](#modulesfeatures_httpservice_internal_md).ICustomResExt

## Table of contents

### Properties

- [\_\_ERROR\_TO\_HANDLE](#__error_to_handle)
- [\_\_EXCEPTION\_ALREADY\_HANDLED](#__exception_already_handled)
- [\_\_NO\_CONTENT](#__no_content)

## Properties

### \_\_ERROR\_TO\_HANDLE

• **\_\_ERROR\_TO\_HANDLE**: `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"error"``\>

#### Defined in

[src/frontend/features/httpService.ts:604](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L604)

___

### \_\_EXCEPTION\_ALREADY\_HANDLED

• **\_\_EXCEPTION\_ALREADY\_HANDLED**: ``true``

#### Defined in

[src/frontend/features/httpService.ts:605](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L605)

___

### \_\_NO\_CONTENT

• **\_\_NO\_CONTENT**: ``true``

#### Defined in

[src/frontend/features/httpService.ts:603](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L603)

[fake-pev-shopping](#readmemd) / [features/httpService](#modulesfeatures_httpservicemd) / [<internal\>](#modulesfeatures_httpservice_internal_md) / IEmbracedResponse

# Interface: IEmbracedResponse<PayloadType\>

[features/httpService](#modulesfeatures_httpservicemd).[<internal>](#modulesfeatures_httpservice_internal_md).IEmbracedResponse

## Type parameters

| Name | Type |
| :------ | :------ |
| `PayloadType` | `never` |

## Table of contents

### Properties

- [authToken](#authtoken)
- [error](#error)
- [exception](#exception)
- [message](#message)
- [payload](#payload)

## Properties

### authToken

• **authToken**: ``null`` \| `string`

#### Defined in

[src/middleware/helpers/middleware-response-wrapper.ts:11](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/middleware/helpers/middleware-response-wrapper.ts#L11)

___

### error

• **error**: `string`

#### Defined in

[src/middleware/helpers/middleware-response-wrapper.ts:14](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/middleware/helpers/middleware-response-wrapper.ts#L14)

___

### exception

• **exception**: `Error` \| { `message`: `string` ; `stack?`: `string`  }

#### Defined in

[src/middleware/helpers/middleware-response-wrapper.ts:15](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/middleware/helpers/middleware-response-wrapper.ts#L15)

___

### message

• **message**: `string`

#### Defined in

[src/middleware/helpers/middleware-response-wrapper.ts:13](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/middleware/helpers/middleware-response-wrapper.ts#L13)

___

### payload

• **payload**: `Record`<`string`, `unknown`\> \| `unknown`[] \| `PayloadType`

#### Defined in

[src/middleware/helpers/middleware-response-wrapper.ts:12](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/middleware/helpers/middleware-response-wrapper.ts#L12)

[fake-pev-shopping](#readmemd) / [features/httpService](#modulesfeatures_httpservicemd) / [<internal\>](#modulesfeatures_httpservice_internal_md) / IOrderPayload

# Interface: IOrderPayload

[features/httpService](#modulesfeatures_httpservicemd).[<internal>](#modulesfeatures_httpservice_internal_md).IOrderPayload

## Table of contents

### Properties

- [payment](#payment)
- [products](#products)
- [receiver](#receiver)
- [shipment](#shipment)

## Properties

### payment

• **payment**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `method` | ``"cash"`` \| ``"card"`` \| ``"transfer"`` \| ``"blik"`` |

#### Defined in

[commons/types.ts:78](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/commons/types.ts#L78)

___

### products

• **products**: `Pick`<[`IProductInOrder`](#interfacesfeatures_httpservice_internal_iproductinordermd), ``"id"`` \| ``"quantity"``\>[]

#### Defined in

[commons/types.ts:85](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/commons/types.ts#L85)

___

### receiver

• **receiver**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `email` | `string` |
| `name` | `string` |
| `phone` | `string` |

#### Defined in

[commons/types.ts:73](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/commons/types.ts#L73)

___

### shipment

• **shipment**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `method` | ``"inPerson"`` \| ``"home"`` \| ``"parcelLocker"`` |

#### Defined in

[commons/types.ts:81](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/commons/types.ts#L81)

[fake-pev-shopping](#readmemd) / [features/httpService](#modulesfeatures_httpservicemd) / [<internal\>](#modulesfeatures_httpservice_internal_md) / IProduct

# Interface: IProduct

[features/httpService](#modulesfeatures_httpservicemd).[<internal>](#modulesfeatures_httpservice_internal_md).IProduct

## Hierarchy

- `Document`

  ↳ **`IProduct`**

## Table of contents

### Properties

- [availability](#availability)
- [category](#category)
- [createdAt](#createdat)
- [images](#images)
- [name](#name)
- [orderedUnits](#orderedunits)
- [price](#price)
- [relatedProductsNames](#relatedproductsnames)
- [reviews](#reviews)
- [shortDescription](#shortdescription)
- [technicalSpecs](#technicalspecs)
- [url](#url)

### Methods

- [addReview](#addreview)
- [prepareUrlField](#prepareurlfield)
- [transformImagesToImagePaths](#transformimagestoimagepaths)
- [validateReviewDuplicatedAuthor](#validatereviewduplicatedauthor)

## Properties

### availability

• **availability**: `number`

#### Defined in

[src/database/models/_product.ts:500](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/database/models/_product.ts#L500)

___

### category

• **category**: `string`

#### Defined in

[src/database/models/_product.ts:489](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/database/models/_product.ts#L489)

___

### createdAt

• **createdAt**: `number`

#### Defined in

[src/database/models/_product.ts:502](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/database/models/_product.ts#L502)

___

### images

• **images**: { `name`: `string` ; `src`: `string`  }[]

#### Defined in

[src/database/models/_product.ts:497](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/database/models/_product.ts#L497)

___

### name

• **name**: `string`

#### Defined in

[src/database/models/_product.ts:487](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/database/models/_product.ts#L487)

___

### orderedUnits

• **orderedUnits**: `number`

#### Defined in

[src/database/models/_product.ts:501](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/database/models/_product.ts#L501)

___

### price

• **price**: `number`

#### Defined in

[src/database/models/_product.ts:490](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/database/models/_product.ts#L490)

___

### relatedProductsNames

• **relatedProductsNames**: `string`[]

#### Defined in

[src/database/models/_product.ts:498](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/database/models/_product.ts#L498)

___

### reviews

• **reviews**: `IReviews`

#### Defined in

[src/database/models/_product.ts:499](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/database/models/_product.ts#L499)

___

### shortDescription

• **shortDescription**: `string`[]

#### Defined in

[src/database/models/_product.ts:491](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/database/models/_product.ts#L491)

___

### technicalSpecs

• **technicalSpecs**: { `data`: `unknown` ; `defaultUnit`: `string` ; `heading`: `string`  }[]

#### Defined in

[src/database/models/_product.ts:492](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/database/models/_product.ts#L492)

___

### url

• **url**: `string`

#### Defined in

[src/database/models/_product.ts:488](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/database/models/_product.ts#L488)

## Methods

### addReview

▸ **addReview**(`newReviewEntry`, `reviewAuthor`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `newReviewEntry` | `IReviewItem` |
| `reviewAuthor` | `string` |

#### Returns

`void`

#### Defined in

[src/database/models/_product.ts:509](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/database/models/_product.ts#L509)

___

### prepareUrlField

▸ **prepareUrlField**(): `void`

#### Returns

`void`

#### Defined in

[src/database/models/_product.ts:504](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/database/models/_product.ts#L504)

___

### transformImagesToImagePaths

▸ **transformImagesToImagePaths**(): `void`

#### Returns

`void`

#### Defined in

[src/database/models/_product.ts:505](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/database/models/_product.ts#L505)

___

### validateReviewDuplicatedAuthor

▸ **validateReviewDuplicatedAuthor**(`reviewAuthor`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `reviewAuthor` | `string` |

#### Returns

`boolean`

#### Defined in

[src/database/models/_product.ts:506](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/database/models/_product.ts#L506)

[fake-pev-shopping](#readmemd) / [features/httpService](#modulesfeatures_httpservicemd) / [<internal\>](#modulesfeatures_httpservice_internal_md) / IProductInOrder

# Interface: IProductInOrder

[features/httpService](#modulesfeatures_httpservicemd).[<internal>](#modulesfeatures_httpservice_internal_md).IProductInOrder

## Table of contents

### Properties

- [id](#id)
- [quantity](#quantity)
- [unitPrice](#unitprice)

## Properties

### id

• **id**: `ObjectId`

#### Defined in

[commons/types.ts:28](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/commons/types.ts#L28)

___

### quantity

• **quantity**: `number`

#### Defined in

[commons/types.ts:30](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/commons/types.ts#L30)

___

### unitPrice

• **unitPrice**: `number`

#### Defined in

[commons/types.ts:29](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/commons/types.ts#L29)

[fake-pev-shopping](#readmemd) / [components/pages/\_routes](#modulescomponents_pages__routesmd) / <internal\>

# Namespace: <internal\>

[components/pages/_routes](#modulescomponents_pages__routesmd).<internal>

## Table of contents

### Classes

- [StoreService](#classescomponents_pages__routes_internal_storeservicemd)

### Interfaces

- [IUserCart](#interfacescomponents_pages__routes_internal_iusercartmd)

### Type Aliases

- [TUserPublic](#tuserpublic)

## Type Aliases

### TUserPublic

Ƭ **TUserPublic**: `Pick`<`IUser`, ``"login"`` \| ``"email"`` \| ``"observedProductsIDs"``\> & { `_id`: `Types.ObjectId` ; `accountType`: `NonNullable`<`IUser`[``"accountType"``]\>[``"roleName"``]  }

#### Defined in

[src/database/models/_user.ts:306](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/database/models/_user.ts#L306)

[fake-pev-shopping](#readmemd) / components/pages/\_routes

# Module: components/pages/\_routes

Encapsulates routing paths and methods (such as helpers and guards).

## Table of contents

### Namespaces

- [&lt;internal\&gt;](#modulescomponents_pages__routes_internal_md)

### Variables

- [ROUTES](#routes)
- [routeHelpers](#routehelpers)

### Functions

- [useRoutesGuards](#useroutesguards)

## Variables

### ROUTES

• `Const` **ROUTES**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `ACCOUNT` | `string` |
| `CONFIRM_REGISTRATION` | ``"/pages/confirm-registration"`` |
| `LOG_IN` | ``"/pages/log-in"`` |
| `NOT_AUTHORIZED` | ``"/pages/not-authorized"`` |
| `NOT_FOUND` | ``"/pages/not-found"`` |
| `NOT_LOGGED_IN` | ``"/pages/not-logged-in"`` |
| `PAGES` | ``"/pages"`` |
| `PRODUCTS` | `string` |
| `PRODUCTS__ADD_NEW_PRODUCT` | \`${string}/add-new-product\` |
| `PRODUCTS__COMPARE` | \`${string}/compare\` |
| `PRODUCTS__ORDER` | \`${string}/order\` |
| `PRODUCTS__PRODUCT` | \`${string}/:productUrl\` |
| `REGISTER` | ``"/pages/register"`` |
| `RESET_PASSWORD` | ``"/pages/reset-password"`` |
| `ROOT` | ``"/"`` |
| `SET_NEW_PASSWORD` | ``"/pages/set-new-password"`` |
| ``get` **ACCOUNT__OBSERVED_PRODUCTS**(): `string`` | {} |
| ``get` **ACCOUNT__ORDERS**(): `string`` | {} |
| ``get` **ACCOUNT__SECURITY**(): `string`` | {} |
| ``get` **ACCOUNT__USER_PROFILE**(): `string`` | {} |
| ``get` **PRODUCTS__MODIFY_PRODUCT**(): `string`` | {} |

#### Defined in

[src/frontend/components/pages/_routes.ts:23](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/components/pages/_routes.ts#L23)

___

### routeHelpers

• `Const` **routeHelpers**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `createModifyProductUrl` | (`productUrl`: `string`) => `string` |
| `createProductsDashboardQueryUpdater` | (`currentQueryParams`: `ParsedQuery`<`string`\>, `pathname`: `string`, `history`: `History`<`unknown`\>) => (`updates`: ``null`` \| { `[key: string]`: `string` \| `number` \| `boolean`;  }) => `void` |
| `extractProductUrlFromPathname` | (`pathname`: `string`) => `string` |
| `getPossibleAriaCurrentPage` | (`url`: `string`, `shouldCheckHash`: `boolean`) => { `aria-current`: `string` \| `boolean`  } |
| `getPossibleNavItemSelectedState` | (`url`: `string`, `shouldCheckHash`: `boolean`) => { `selected`: `boolean`  } |
| `parseSearchParams` | (`search`: `string`) => `ParsedQuery`<`string` \| `number` \| `boolean`\> |
| `stringifySearchParams` | (`payload`: `Record`<`string`, `unknown`\>) => `string` |

#### Defined in

[src/frontend/components/pages/_routes.ts:64](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/components/pages/_routes.ts#L64)

## Functions

### useRoutesGuards

▸ **useRoutesGuards**(`storeService`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `storeService` | [`StoreService`](#classescomponents_pages__routes_internal_storeservicemd) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `isClient` | () => ``null`` \| `boolean` |
| `isGuest` | () => `boolean` |
| `isSeller` | () => ``null`` \| `boolean` |
| `isUser` | () => `boolean` |

#### Defined in

[src/frontend/components/pages/_routes.ts:109](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/components/pages/_routes.ts#L109)

[fake-pev-shopping](#readmemd) / [components/utils/bodyObserver](#modulescomponents_utils_bodyobservermd) / <internal\>

# Namespace: <internal\>

[components/utils/bodyObserver](#modulescomponents_utils_bodyobservermd).<internal>

## Table of contents

### Type Aliases

- [TSubscriptionCallback](#tsubscriptioncallback)

## Type Aliases

### TSubscriptionCallback

Ƭ **TSubscriptionCallback**: `Object`

#### Call signature

▸ (`bodyStyle`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `bodyStyle` | `CSSStyleDeclaration` |

##### Returns

`void`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `subscriptionID` | `number` |

#### Defined in

[src/frontend/components/utils/bodyObserver.tsx:7](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/components/utils/bodyObserver.tsx#L7)

[fake-pev-shopping](#readmemd) / components/utils/bodyObserver

# Module: components/utils/bodyObserver

Handles HTML `<body>` style changes, which affect position of components,
such as `ScrollToTop` button and `ProductComparisonCandidates` bar.

## Table of contents

### Namespaces

- [&lt;internal\&gt;](#modulescomponents_utils_bodyobserver_internal_md)

### Functions

- [subscribeToBodyMutations](#subscribetobodymutations)
- [unSubscribeFromBodyMutations](#unsubscribefrombodymutations)

## Functions

### subscribeToBodyMutations

▸ **subscribeToBodyMutations**(`callback`): `number`

Subscribes a provided `callback` to `<body>` style mutations.

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | [`TSubscriptionCallback`](#tsubscriptioncallback) |

#### Returns

`number`

subscriptionID, which lets unsubscribing `callback` later.

#### Defined in

[src/frontend/components/utils/bodyObserver.tsx:26](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/components/utils/bodyObserver.tsx#L26)

___

### unSubscribeFromBodyMutations

▸ **unSubscribeFromBodyMutations**(`subscriptionID`): `void`

Unsubscribes previously subscribed `callback` (via it's ID) from `<body>` style mutations.

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscriptionID` | `number` |

#### Returns

`void`

#### Defined in

[src/frontend/components/utils/bodyObserver.tsx:36](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/components/utils/bodyObserver.tsx#L36)

[fake-pev-shopping](#readmemd) / components/utils/flexibleList

# Module: components/utils/flexibleList

Flexible list component, which allows adding, editing and deleting it's items in a customizable way.

## Table of contents

### Functions

- [FlexibleList](#flexiblelist)

## Functions

### FlexibleList

▸ **FlexibleList**(`__namedParameters`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Returns

`Element`

#### Defined in

[src/frontend/components/utils/flexibleList.jsx:73](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/components/utils/flexibleList.jsx#L73)

[fake-pev-shopping](#readmemd) / components/utils/pagination

# Module: components/utils/pagination

## Table of contents

### Functions

- [Pagination](#pagination)

## Functions

### Pagination

▸ **Pagination**(`props`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `any` |

#### Returns

`Element`

#### Defined in

[src/frontend/components/utils/pagination.jsx:21](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/components/utils/pagination.jsx#L21)

[fake-pev-shopping](#readmemd) / components/utils/pevElements

# Module: components/utils/pevElements

Facade over commonly used MUI and native HTML elements.

## Table of contents

### Variables

- [PEVButton](#pevbutton)
- [PEVCheckbox](#pevcheckbox)
- [PEVFieldset](#pevfieldset)
- [PEVForm](#pevform)
- [PEVHeading](#pevheading)
- [PEVIconButton](#peviconbutton)
- [PEVImage](#pevimage)
- [PEVLegend](#pevlegend)
- [PEVLink](#pevlink)
- [PEVParagraph](#pevparagraph)
- [PEVPopover](#pevpopover)
- [PEVRadio](#pevradio)
- [PEVTabs](#pevtabs)

### Functions

- [PEVFormFieldError](#pevformfielderror)
- [PEVLoadingAnimation](#pevloadinganimation)
- [PEVSuspense](#pevsuspense)
- [PEVTextField](#pevtextfield)

## Variables

### PEVButton

• `Const` **PEVButton**: `ForwardRefExoticComponent`<`RefAttributes`<`any`\>\>

#### Defined in

[src/frontend/components/utils/pevElements.jsx:58](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/components/utils/pevElements.jsx#L58)

___

### PEVCheckbox

• `Const` **PEVCheckbox**: `ForwardRefExoticComponent`<`RefAttributes`<`any`\>\>

#### Defined in

[src/frontend/components/utils/pevElements.jsx:191](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/components/utils/pevElements.jsx#L191)

___

### PEVFieldset

• `Const` **PEVFieldset**: `ForwardRefExoticComponent`<`RefAttributes`<`any`\>\>

#### Defined in

[src/frontend/components/utils/pevElements.jsx:100](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/components/utils/pevElements.jsx#L100)

___

### PEVForm

• `Const` **PEVForm**: `ForwardRefExoticComponent`<`RefAttributes`<`any`\>\>

#### Defined in

[src/frontend/components/utils/pevElements.jsx:199](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/components/utils/pevElements.jsx#L199)

___

### PEVHeading

• `Const` **PEVHeading**: `ForwardRefExoticComponent`<`RefAttributes`<`any`\>\>

#### Defined in

[src/frontend/components/utils/pevElements.jsx:238](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/components/utils/pevElements.jsx#L238)

___

### PEVIconButton

• `Const` **PEVIconButton**: `ForwardRefExoticComponent`<`RefAttributes`<`any`\>\>

#### Defined in

[src/frontend/components/utils/pevElements.jsx:76](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/components/utils/pevElements.jsx#L76)

___

### PEVImage

• `Const` **PEVImage**: `ForwardRefExoticComponent`<`RefAttributes`<`any`\>\>

#### Defined in

[src/frontend/components/utils/pevElements.jsx:373](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/components/utils/pevElements.jsx#L373)

___

### PEVLegend

• `Const` **PEVLegend**: `ForwardRefExoticComponent`<`RefAttributes`<`any`\>\>

#### Defined in

[src/frontend/components/utils/pevElements.jsx:108](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/components/utils/pevElements.jsx#L108)

___

### PEVLink

• `Const` **PEVLink**: `ForwardRefExoticComponent`<`RefAttributes`<`any`\>\>

#### Defined in

[src/frontend/components/utils/pevElements.jsx:92](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/components/utils/pevElements.jsx#L92)

___

### PEVParagraph

• `Const` **PEVParagraph**: `ForwardRefExoticComponent`<`RefAttributes`<`any`\>\>

#### Defined in

[src/frontend/components/utils/pevElements.jsx:252](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/components/utils/pevElements.jsx#L252)

___

### PEVPopover

• `Const` **PEVPopover**: `ForwardRefExoticComponent`<`RefAttributes`<`any`\>\>

#### Defined in

[src/frontend/components/utils/pevElements.jsx:426](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/components/utils/pevElements.jsx#L426)

___

### PEVRadio

• `Const` **PEVRadio**: `ForwardRefExoticComponent`<`RefAttributes`<`any`\>\>

#### Defined in

[src/frontend/components/utils/pevElements.jsx:195](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/components/utils/pevElements.jsx#L195)

___

### PEVTabs

• `Const` **PEVTabs**: `ForwardRefExoticComponent`<`RefAttributes`<`any`\>\>

#### Defined in

[src/frontend/components/utils/pevElements.jsx:300](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/components/utils/pevElements.jsx#L300)

## Functions

### PEVFormFieldError

▸ **PEVFormFieldError**(`__namedParameters`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Returns

`Element`

#### Defined in

[src/frontend/components/utils/pevElements.jsx:230](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/components/utils/pevElements.jsx#L230)

___

### PEVLoadingAnimation

▸ **PEVLoadingAnimation**(`__namedParameters`): ``null`` \| `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Returns

``null`` \| `Element`

#### Defined in

[src/frontend/components/utils/pevElements.jsx:486](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/components/utils/pevElements.jsx#L486)

___

### PEVSuspense

▸ **PEVSuspense**(`__namedParameters`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Returns

`Element`

#### Defined in

[src/frontend/components/utils/pevElements.jsx:515](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/components/utils/pevElements.jsx#L515)

___

### PEVTextField

▸ **PEVTextField**(`__namedParameters`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Returns

`Element`

#### Defined in

[src/frontend/components/utils/pevElements.jsx:116](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/components/utils/pevElements.jsx#L116)

[fake-pev-shopping](#readmemd) / components/utils/popup

# Module: components/utils/popup

## Table of contents

### Variables

- [GenericErrorPopup](#genericerrorpopup)
- [POPUP\_TYPES](#popup_types)

### Functions

- [Popup](#popup)
- [getClosePopupBtn](#getclosepopupbtn)

## Variables

### GenericErrorPopup

• `Const` **GenericErrorPopup**: `NamedExoticComponent`<`object`\>

Generic error popup component is hooked on [HttpService](#classesfeatures_httpservice_internal_httpservicemd) to present user any errors in more friendly way.

#### Defined in

[src/frontend/components/utils/popup.jsx:58](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/components/utils/popup.jsx#L58)

___

### POPUP\_TYPES

• `Const` **POPUP\_TYPES**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `FAILURE` | `string` |
| `NEUTRAL` | `string` |
| `SUCCESS` | `string` |

#### Defined in

[src/frontend/components/utils/popup.jsx:17](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/components/utils/popup.jsx#L17)

## Functions

### Popup

▸ **Popup**(`props`): ``null`` \| `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `any` |

#### Returns

``null`` \| `Element`

#### Defined in

[src/frontend/components/utils/popup.jsx:93](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/components/utils/popup.jsx#L93)

___

### getClosePopupBtn

▸ **getClosePopupBtn**(`setPopupData`): `Object`

Factory for popup's default closing button.

#### Parameters

| Name | Type |
| :------ | :------ |
| `setPopupData` | `any` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `dataCy` | `string` |
| `onClick` | () => `any` |
| `text` | `string` |

#### Defined in

[src/frontend/components/utils/popup.jsx:26](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/components/utils/popup.jsx#L26)

[fake-pev-shopping](#readmemd) / components/utils/ratingWidget

# Module: components/utils/ratingWidget

## Table of contents

### Functions

- [RatingWidget](#ratingwidget)

## Functions

### RatingWidget

▸ **RatingWidget**(`__namedParameters`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Returns

`Element`

#### Defined in

[src/frontend/components/utils/ratingWidget.jsx:30](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/components/utils/ratingWidget.jsx#L30)

[fake-pev-shopping](#readmemd) / components/utils/scroller

# Module: components/utils/scroller

## Table of contents

### Functions

- [Scroller](#scroller)

## Functions

### Scroller

▸ **Scroller**(`__namedParameters`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Returns

`Element`

#### Defined in

[src/frontend/components/utils/scroller.jsx:95](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/components/utils/scroller.jsx#L95)

[fake-pev-shopping](#readmemd) / contexts/rwd-layout

# Module: contexts/rwd-layout

Observes DOM viewport changes and emits information about the currently established one.

## Table of contents

### Functions

- [RWDLayoutProvider](#rwdlayoutprovider)
- [useRWDLayout](#userwdlayout)

## Functions

### RWDLayoutProvider

▸ **RWDLayoutProvider**(`__namedParameters`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `PropsWithChildren`<`Record`<`string`, `unknown`\>\> |

#### Returns

`Element`

#### Defined in

[src/frontend/contexts/rwd-layout.tsx:79](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/contexts/rwd-layout.tsx#L79)

___

### useRWDLayout

▸ **useRWDLayout**(): `Object`

#### Returns

`Object`

#### Defined in

[src/frontend/contexts/rwd-layout.tsx:83](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/contexts/rwd-layout.tsx#L83)

[fake-pev-shopping](#readmemd) / [features/httpService](#modulesfeatures_httpservicemd) / <internal\>

# Namespace: <internal\>

[features/httpService](#modulesfeatures_httpservicemd).<internal>

## Table of contents

### Classes

- [Ajax](#classesfeatures_httpservice_internal_ajaxmd)
- [HttpService](#classesfeatures_httpservice_internal_httpservicemd)

### Interfaces

- [ICustomResExt](#interfacesfeatures_httpservice_internal_icustomresextmd)
- [IEmbracedResponse](#interfacesfeatures_httpservice_internal_iembracedresponsemd)
- [IOrderPayload](#interfacesfeatures_httpservice_internal_iorderpayloadmd)
- [IProduct](#interfacesfeatures_httpservice_internal_iproductmd)
- [IProductInOrder](#interfacesfeatures_httpservice_internal_iproductinordermd)

### Type Aliases

- [TIntermediateSpecsValues](#tintermediatespecsvalues)
- [TOutputSpecs](#toutputspecs)
- [TPagination](#tpagination)
- [TProductTechnicalSpecs](#tproducttechnicalspecs)
- [TSubCallback](#tsubcallback)
- [TUserRegistrationCredentials](#tuserregistrationcredentials)

## Type Aliases

### TIntermediateSpecsValues

Ƭ **TIntermediateSpecsValues**: (`string` \| `number`)[] \| `Record`<`string`, `number`[]\>

#### Defined in

[src/middleware/helpers/api-products-specs-mapper.ts:4](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/middleware/helpers/api-products-specs-mapper.ts#L4)

___

### TOutputSpecs

Ƭ **TOutputSpecs**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `defaultUnit` | `string` |
| `name` | `string` |
| `values` | [`TIntermediateSpecsValues`](#tintermediatespecsvalues) |

#### Defined in

[src/middleware/helpers/api-products-specs-mapper.ts:8](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/middleware/helpers/api-products-specs-mapper.ts#L8)

___

### TPagination

Ƭ **TPagination**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `pageNumber` | `number` |
| `productsPerPage` | `number` |

#### Defined in

[commons/types.ts:88](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/commons/types.ts#L88)

___

### TProductTechnicalSpecs

Ƭ **TProductTechnicalSpecs**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `categoryToSpecs` | `Record`<`string`, `string`[]\> |
| `specs` | [`TOutputSpecs`](#toutputspecs)[] |

#### Defined in

[src/middleware/helpers/api-products-specs-mapper.ts:13](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/middleware/helpers/api-products-specs-mapper.ts#L13)

___

### TSubCallback

Ƭ **TSubCallback**: (...`args`: `unknown`[]) => `unknown`

#### Type declaration

▸ (...`args`): `unknown`

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `unknown`[] |

##### Returns

`unknown`

#### Defined in

[src/frontend/features/httpService.ts:565](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L565)

___

### TUserRegistrationCredentials

Ƭ **TUserRegistrationCredentials**: `Pick`<`IUser`, ``"login"`` \| ``"password"`` \| ``"email"``\> & { `repeatedPassword`: `IUser`[``"password"``]  }

#### Defined in

[src/database/models/_user.ts:352](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/database/models/_user.ts#L352)

[fake-pev-shopping](#readmemd) / features/httpService

# Module: features/httpService

Handles HTTP communication between frontend and backend.

## Table of contents

### Namespaces

- [&lt;internal\&gt;](#modulesfeatures_httpservice_internal_md)

### Variables

- [CUSTOM\_RES\_EXT\_DICT](#custom_res_ext_dict)
- [httpService](#httpservice)
- [httpServiceSubscriber](#httpservicesubscriber)

## Variables

### CUSTOM\_RES\_EXT\_DICT

• `Const` **CUSTOM\_RES\_EXT\_DICT**: `Readonly`<{ `__ERROR_TO_HANDLE`: ``"__ERROR_TO_HANDLE"`` = '\_\_ERROR\_TO\_HANDLE'; `__EXCEPTION_ALREADY_HANDLED`: ``"__EXCEPTION_ALREADY_HANDLED"`` = '\_\_EXCEPTION\_ALREADY\_HANDLED'; `__NO_CONTENT`: ``"__NO_CONTENT"`` = '\_\_NO\_CONTENT' }\>

Recognize HTTP responses kinds.

#### Defined in

[src/frontend/features/httpService.ts:596](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L596)

___

### httpService

• **httpService**: [`HttpService`](#classesfeatures_httpservice_internal_httpservicemd)

#### Defined in

[src/frontend/features/httpService.ts:610](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L610)

___

### httpServiceSubscriber

• `Const` **httpServiceSubscriber**: `Object`

Keeps track of [HttpService](#classesfeatures_httpservice_internal_httpservicemd) subscribers, which want to externally hook into any request
that returns certain status.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `SUBSCRIPTION_TYPE` | `Readonly`<{ `[k: string]`: `T`;  }\> |
| `callSubscribers` | (`type`: `string`, `value`: `unknown`) => `unknown` |
| `subscribe` | (`type`: `string`, `callback`: [`TSubCallback`](#tsubcallback)) => `void` |
| `unSubscribe` | (`type`: `string`) => `void` |

#### Defined in

[src/frontend/features/httpService.ts:560](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/httpService.ts#L560)

[fake-pev-shopping](#readmemd) / [features/storageService](#modulesfeatures_storageservicemd) / <internal\>

# Namespace: <internal\>

[features/storageService](#modulesfeatures_storageservicemd).<internal>

## Table of contents

### Classes

- [StorageService](#classesfeatures_storageservice_internal_storageservicemd)
- [UserAccount](#classesfeatures_storageservice_internal_useraccountmd)
- [UserAuthToken](#classesfeatures_storageservice_internal_userauthtokenmd)
- [UserCart](#classesfeatures_storageservice_internal_usercartmd)

### Type Aliases

- [TStorageValue](#tstoragevalue)

## Type Aliases

### TStorageValue

Ƭ **TStorageValue**: [`IUserCart`](#interfacescomponents_pages__routes_internal_iusercartmd) \| [`TUserPublic`](#tuserpublic) \| `NonNullable`<`IUser`[``"tokens"``][``"auth"``]\>[`number`] \| ``null``

#### Defined in

[src/frontend/features/storageService.ts:9](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storageService.ts#L9)

[fake-pev-shopping](#readmemd) / features/storageService

# Module: features/storageService

Handles reading and manipulating browser's LocalStorage data.

## Table of contents

### Namespaces

- [&lt;internal\&gt;](#modulesfeatures_storageservice_internal_md)

### Variables

- [storageService](#storageservice)

## Variables

### storageService

• `Const` **storageService**: `Object`

Manipulating storage data API for various contexts, such as `UserCart` or `UserAccount`.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `userAccount` | [`UserAccount`](#classesfeatures_storageservice_internal_useraccountmd) |
| `userAuthToken` | [`UserAuthToken`](#classesfeatures_storageservice_internal_userauthtokenmd) |
| `userCart` | [`UserCart`](#classesfeatures_storageservice_internal_usercartmd) |

#### Defined in

[src/frontend/features/storageService.ts:14](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storageService.ts#L14)

[fake-pev-shopping](#readmemd) / features/storeService

# Module: features/storeService

## Table of contents

### Type Aliases

- [TStoreService](#tstoreservice)

### Variables

- [storeService](#storeservice)

## Type Aliases

### TStoreService

Ƭ **TStoreService**: typeof [`storeService`](#storeservice)

#### Defined in

[src/frontend/features/storeService.ts:185](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storeService.ts#L185)

## Variables

### storeService

• `Const` **storeService**: [`StoreService`](#classescomponents_pages__routes_internal_storeservicemd)

#### Defined in

[src/frontend/features/storeService.ts:177](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/storeService.ts#L177)

[fake-pev-shopping](#readmemd) / features/userSessionService

# Module: features/userSessionService

## Table of contents

### Variables

- [userSessionService](#usersessionservice)

## Variables

### userSessionService

• `Const` **userSessionService**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `logIn` | (`logInCredentials`: `Pick`<`IUser`, ``"login"`` \| ``"password"``\>) => `Promise`<[`TUserPublic`](#tuserpublic) \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__EXCEPTION_ALREADY_HANDLED"``\>\> |
| `logOut` | () => `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\> |
| `logOutFromMultipleSessions` | (`shouldPreserveCurrentSession`: `boolean`) => `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\> |
| `restoreSession` | () => `void` |

#### Defined in

[src/frontend/features/userSessionService.ts:12](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/0723e45/src/frontend/features/userSessionService.ts#L12)
