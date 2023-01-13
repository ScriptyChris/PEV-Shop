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

[src/frontend/features/storeService.ts:27](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storeService.ts#L27)

## Accessors

### productComparisonState

• `get` **productComparisonState**(): [`TUserCartProduct`](#tusercartproduct)[]

#### Returns

[`TUserCartProduct`](#tusercartproduct)[]

#### Defined in

[src/frontend/features/storeService.ts:143](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storeService.ts#L143)

___

### userAccountState

• `get` **userAccountState**(): ``null`` \| [`TUserPublic`](#tuserpublic)

#### Returns

``null`` \| [`TUserPublic`](#tuserpublic)

#### Defined in

[src/frontend/features/storeService.ts:139](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storeService.ts#L139)

___

### userCartProducts

• `get` **userCartProducts**(): { `_id`: `string` ; `name`: `string` ; `price`: `number`  }[]

#### Returns

{ `_id`: `string` ; `name`: `string` ; `price`: `number`  }[]

#### Defined in

[src/frontend/features/storeService.ts:127](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storeService.ts#L127)

___

### userCartProductsCount

• `get` **userCartProductsCount**(): `number`

#### Returns

`number`

#### Defined in

[src/frontend/features/storeService.ts:135](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storeService.ts#L135)

___

### userCartState

• `get` **userCartState**(): [`IUserCart`](#interfacescomponents_pages__routes_internal_iusercartmd)

#### Returns

[`IUserCart`](#interfacescomponents_pages__routes_internal_iusercartmd)

#### Defined in

[src/frontend/features/storeService.ts:123](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storeService.ts#L123)

___

### userCartTotalPrice

• `get` **userCartTotalPrice**(): `number`

#### Returns

`number`

#### Defined in

[src/frontend/features/storeService.ts:131](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storeService.ts#L131)

## Methods

### addProductToUserCartState

▸ **addProductToUserCartState**(`newUserCartState`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `newUserCartState` | [`TUserCartProduct`](#tusercartproduct) |

#### Returns

`void`

#### Defined in

[src/frontend/features/storeService.ts:47](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storeService.ts#L47)

___

### clearProductComparisonState

▸ **clearProductComparisonState**(): `void`

#### Returns

`void`

#### Defined in

[src/frontend/features/storeService.ts:111](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storeService.ts#L111)

___

### clearProductObservedState

▸ **clearProductObservedState**(): `void`

#### Returns

`void`

#### Defined in

[src/frontend/features/storeService.ts:119](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storeService.ts#L119)

___

### clearUserAccountState

▸ **clearUserAccountState**(): `void`

#### Returns

`void`

#### Defined in

[src/frontend/features/storeService.ts:43](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storeService.ts#L43)

___

### clearUserCartState

▸ **clearUserCartState**(): `void`

#### Returns

`void`

#### Defined in

[src/frontend/features/storeService.ts:81](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storeService.ts#L81)

___

### removeProductFromUserCartState

▸ **removeProductFromUserCartState**(`newUserCartState`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `newUserCartState` | [`TUserCartProduct`](#tusercartproduct) |

#### Returns

`void`

#### Defined in

[src/frontend/features/storeService.ts:61](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storeService.ts#L61)

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

[src/frontend/features/storeService.ts:88](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storeService.ts#L88)

___

### updateProductComparisonState

▸ **updateProductComparisonState**(`__namedParameters`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.add` | [`TUserCartProduct`](#tusercartproduct) |
| `__namedParameters.remove` | `Partial`<{ `_id`: `string` ; `index`: `number`  }\> |

#### Returns

`void`

#### Defined in

[src/frontend/features/storeService.ts:94](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storeService.ts#L94)

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

[src/frontend/features/storeService.ts:115](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storeService.ts#L115)

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

[src/frontend/features/storeService.ts:39](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storeService.ts#L39)

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

- [\_preparePaginationParams](#_preparepaginationparams)
- [addProduct](#addproduct)
- [addProductReview](#addproductreview)
- [addProductToObserved](#addproducttoobserved)
- [changePassword](#changepassword)
- [confirmRegistration](#confirmregistration)
- [deleteProduct](#deleteproduct)
- [getCurrentUser](#getcurrentuser)
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

[src/frontend/features/httpService.ts:236](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L236)

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

[src/frontend/features/httpService.ts:227](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L227)

## Methods

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

[src/frontend/features/httpService.ts:240](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L240)

___

### addProduct

▸ **addProduct**(`product`): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Adds a new product.

#### Parameters

| Name | Type |
| :------ | :------ |
| `product` | `IProduct` |

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:254](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L254)

___

### addProductReview

▸ **addProductReview**(`productName`, `productReview`): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Adds a new review to chosen product.

#### Parameters

| Name | Type |
| :------ | :------ |
| `productName` | `string` |
| `productReview` | `IReviews` |

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:383](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L383)

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

[src/frontend/features/httpService.ts:496](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L496)

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

[src/frontend/features/httpService.ts:489](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L489)

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

[src/frontend/features/httpService.ts:468](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L468)

___

### deleteProduct

▸ **deleteProduct**(`productName`): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Delets a product via it's name.

#### Parameters

| Name | Type |
| :------ | :------ |
| `productName` | `string` |

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:390](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L390)

___

### getCurrentUser

▸ **getCurrentUser**(): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Gets info about currently logged in user via it's ID taken from app's state.

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:397](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L397)

___

### getObservedProducts

▸ **getObservedProducts**(): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Retrieves all observed products by user.

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:517](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L517)

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

[src/frontend/features/httpService.ts:337](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L337)

___

### getProductCategories

▸ **getProductCategories**(): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Gets categories of all products.

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:353](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L353)

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

[src/frontend/features/httpService.ts:261](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L261)

___

### getProductsById

▸ **getProductsById**(`idList`): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `idList` | `any`[] |

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:305](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L305)

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

[src/frontend/features/httpService.ts:324](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L324)

___

### getProductsByNames

▸ **getProductsByNames**(`nameList`): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Gets products by list of names - mostly useful for retrieving related products of a single one.

#### Parameters

| Name | Type |
| :------ | :------ |
| `nameList` | `string`[] |

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:312](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L312)

___

### getProductsSpecifications

▸ **getProductsSpecifications**(): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__EXCEPTION_ALREADY_HANDLED"``\> \| [`TProductTechnicalSpecs`](#tproducttechnicalspecs)\>

Gets technical specifications of all products.

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__EXCEPTION_ALREADY_HANDLED"``\> \| [`TProductTechnicalSpecs`](#tproducttechnicalspecs)\>

#### Defined in

[src/frontend/features/httpService.ts:360](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L360)

___

### getUserRoles

▸ **getUserRoles**(): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Gets all user roles.

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:454](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L454)

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

[src/frontend/features/httpService.ts:447](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L447)

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

[src/frontend/features/httpService.ts:417](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L417)

___

### logoutUser

▸ **logoutUser**(): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Loggs out user from current session.

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:440](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L440)

___

### makeOrder

▸ **makeOrder**(`orderDetails`): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Starts the process of making a new purchase according to given order details.

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderDetails` | [`IOrder`](#interfacesfeatures_httpservice_internal_iordermd) |

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:410](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L410)

___

### modifyProduct

▸ **modifyProduct**(`productName`, `productModifications`): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Modifies product.

#### Parameters

| Name | Type |
| :------ | :------ |
| `productName` | `string` |
| `productModifications` | `Partial`<`IProduct`\> |

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:369](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L369)

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

[src/frontend/features/httpService.ts:461](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L461)

___

### removeAllProductsFromObserved

▸ **removeAllProductsFromObserved**(): `Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

Removes all products from observed by user.

#### Returns

`Promise`<`Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__NO_CONTENT"``\> \| `Pick`<[`IEmbracedResponse`](#interfacesfeatures_httpservice_internal_iembracedresponsemd)<`never`\>, ``"authToken"`` \| ``"payload"`` \| ``"message"``\> \| `Pick`<[`ICustomResExt`](#interfacesfeatures_httpservice_internal_icustomresextmd), ``"__ERROR_TO_HANDLE"`` \| ``"__EXCEPTION_ALREADY_HANDLED"``\>\>

#### Defined in

[src/frontend/features/httpService.ts:510](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L510)

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

[src/frontend/features/httpService.ts:503](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L503)

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

[src/frontend/features/httpService.ts:475](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L475)

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

[src/frontend/features/httpService.ts:433](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L433)

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

[src/frontend/features/httpService.ts:426](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L426)

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

[src/frontend/features/httpService.ts:482](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L482)

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

[src/frontend/features/storageService.ts:18](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storageService.ts#L18)

## Properties

### key

• **key**: `string`

#### Defined in

[src/frontend/features/storageService.ts:16](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storageService.ts#L16)

## Methods

### get

▸ **get**(): `any`

#### Returns

`any`

Already parsed (from JSON) stored value.

#### Defined in

[src/frontend/features/storageService.ts:42](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storageService.ts#L42)

___

### remove

▸ **remove**(): `void`

Removes a values.

#### Returns

`void`

#### Defined in

[src/frontend/features/storageService.ts:54](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storageService.ts#L54)

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

[src/frontend/features/storageService.ts:26](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storageService.ts#L26)

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

[src/frontend/features/storageService.ts:70](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storageService.ts#L70)

## Properties

### key

• **key**: `string`

#### Inherited from

[StorageService](#classesfeatures_storageservice_internal_storageservicemd).[key](#key)

#### Defined in

[src/frontend/features/storageService.ts:16](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storageService.ts#L16)

## Methods

### get

▸ **get**(): `any`

#### Returns

`any`

Already parsed (from JSON) stored value.

#### Inherited from

[StorageService](#classesfeatures_storageservice_internal_storageservicemd).[get](#get)

#### Defined in

[src/frontend/features/storageService.ts:42](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storageService.ts#L42)

___

### remove

▸ **remove**(): `void`

Removes a values.

#### Returns

`void`

#### Inherited from

[StorageService](#classesfeatures_storageservice_internal_storageservicemd).[remove](#remove)

#### Defined in

[src/frontend/features/storageService.ts:54](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storageService.ts#L54)

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

[src/frontend/features/storageService.ts:74](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storageService.ts#L74)

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

[src/frontend/features/storageService.ts:80](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storageService.ts#L80)

## Properties

### key

• **key**: `string`

#### Inherited from

[StorageService](#classesfeatures_storageservice_internal_storageservicemd).[key](#key)

#### Defined in

[src/frontend/features/storageService.ts:16](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storageService.ts#L16)

## Methods

### get

▸ **get**(): `any`

#### Returns

`any`

Already parsed (from JSON) stored value.

#### Inherited from

[StorageService](#classesfeatures_storageservice_internal_storageservicemd).[get](#get)

#### Defined in

[src/frontend/features/storageService.ts:42](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storageService.ts#L42)

___

### remove

▸ **remove**(): `void`

Removes a values.

#### Returns

`void`

#### Inherited from

[StorageService](#classesfeatures_storageservice_internal_storageservicemd).[remove](#remove)

#### Defined in

[src/frontend/features/storageService.ts:54](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storageService.ts#L54)

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

[src/frontend/features/storageService.ts:84](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storageService.ts#L84)

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

[src/frontend/features/storageService.ts:60](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storageService.ts#L60)

## Properties

### key

• **key**: `string`

#### Inherited from

[StorageService](#classesfeatures_storageservice_internal_storageservicemd).[key](#key)

#### Defined in

[src/frontend/features/storageService.ts:16](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storageService.ts#L16)

## Methods

### get

▸ **get**(): `any`

#### Returns

`any`

Already parsed (from JSON) stored value.

#### Inherited from

[StorageService](#classesfeatures_storageservice_internal_storageservicemd).[get](#get)

#### Defined in

[src/frontend/features/storageService.ts:42](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storageService.ts#L42)

___

### remove

▸ **remove**(): `void`

Removes a values.

#### Returns

`void`

#### Inherited from

[StorageService](#classesfeatures_storageservice_internal_storageservicemd).[remove](#remove)

#### Defined in

[src/frontend/features/storageService.ts:54](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storageService.ts#L54)

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

[src/frontend/features/storageService.ts:64](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storageService.ts#L64)

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

• **products**: { `_id`: `string` ; `name`: `string` ; `price`: `number`  }[]

#### Defined in

[commons/types.ts:53](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/commons/types.ts#L53)

___

### totalCount

• **totalCount**: `number`

#### Defined in

[commons/types.ts:58](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/commons/types.ts#L58)

___

### totalPrice

• **totalPrice**: `number`

#### Defined in

[commons/types.ts:59](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/commons/types.ts#L59)

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

[src/frontend/features/httpService.ts:570](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L570)

___

### \_\_EXCEPTION\_ALREADY\_HANDLED

• **\_\_EXCEPTION\_ALREADY\_HANDLED**: ``true``

#### Defined in

[src/frontend/features/httpService.ts:571](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L571)

___

### \_\_NO\_CONTENT

• **\_\_NO\_CONTENT**: ``true``

#### Defined in

[src/frontend/features/httpService.ts:569](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L569)

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

[src/middleware/helpers/middleware-response-wrapper.ts:11](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/middleware/helpers/middleware-response-wrapper.ts#L11)

___

### error

• **error**: `string`

#### Defined in

[src/middleware/helpers/middleware-response-wrapper.ts:14](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/middleware/helpers/middleware-response-wrapper.ts#L14)

___

### exception

• **exception**: `Error` \| { `message`: `string` ; `stack?`: `string`  }

#### Defined in

[src/middleware/helpers/middleware-response-wrapper.ts:15](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/middleware/helpers/middleware-response-wrapper.ts#L15)

___

### message

• **message**: `string`

#### Defined in

[src/middleware/helpers/middleware-response-wrapper.ts:13](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/middleware/helpers/middleware-response-wrapper.ts#L13)

___

### payload

• **payload**: `Record`<`string`, `unknown`\> \| `unknown`[] \| `PayloadType`

#### Defined in

[src/middleware/helpers/middleware-response-wrapper.ts:12](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/middleware/helpers/middleware-response-wrapper.ts#L12)

[fake-pev-shopping](#readmemd) / [features/httpService](#modulesfeatures_httpservicemd) / [<internal\>](#modulesfeatures_httpservice_internal_md) / IOrder

# Interface: IOrder

[features/httpService](#modulesfeatures_httpservicemd).[<internal>](#modulesfeatures_httpservice_internal_md).IOrder

## Table of contents

### Properties

- [paymentType](#paymenttype)
- [price](#price)
- [products](#products)
- [receiver](#receiver)
- [shipmentType](#shipmenttype)

## Properties

### paymentType

• **paymentType**: ``"Cash"`` \| ``"Card"`` \| ``"Transfer"`` \| ``"BLIK"``

#### Defined in

[commons/types.ts:73](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/commons/types.ts#L73)

___

### price

• **price**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `shipment` | `number` |
| `total` | `number` |

#### Defined in

[commons/types.ts:75](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/commons/types.ts#L75)

___

### products

• **products**: { `_id`: `string` ; `name`: `string` ; `price`: `number`  }[] & { `count`: `number`  }[]

#### Defined in

[commons/types.ts:74](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/commons/types.ts#L74)

___

### receiver

• **receiver**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `baseInfo` | { `email`: `string` ; `name`: `string` ; `phone`: `string`  } |
| `baseInfo.email` | `string` |
| `baseInfo.name` | `string` |
| `baseInfo.phone` | `string` |

#### Defined in

[commons/types.ts:63](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/commons/types.ts#L63)

___

### shipmentType

• **shipmentType**: ``"inPerson"`` \| ``"home"`` \| ``"parcelLocker"``

#### Defined in

[commons/types.ts:71](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/commons/types.ts#L71)

[fake-pev-shopping](#readmemd) / [components/pages/\_routes](#modulescomponents_pages__routesmd) / <internal\>

# Namespace: <internal\>

[components/pages/_routes](#modulescomponents_pages__routesmd).<internal>

## Table of contents

### Classes

- [StoreService](#classescomponents_pages__routes_internal_storeservicemd)

### Interfaces

- [IUserCart](#interfacescomponents_pages__routes_internal_iusercartmd)

### Type Aliases

- [TUserCartProduct](#tusercartproduct)
- [TUserPublic](#tuserpublic)

## Type Aliases

### TUserCartProduct

Ƭ **TUserCartProduct**: [`IUserCart`](#interfacescomponents_pages__routes_internal_iusercartmd)[``"products"``][`number`] & { `count`: `number`  }

#### Defined in

[src/frontend/features/storeService.ts:17](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storeService.ts#L17)

___

### TUserPublic

Ƭ **TUserPublic**: `Pick`<`IUser`, ``"login"`` \| ``"email"`` \| ``"observedProductsIDs"``\> & { `_id`: `Schema.Types.ObjectId` ; `accountType`: `NonNullable`<`IUser`[``"accountType"``]\>[``"roleName"``]  }

#### Defined in

[src/database/models/_user.ts:242](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/database/models/_user.ts#L242)

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
| `PRODUCTS__PRODUCT` | \`${string}/:productName\` |
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

[src/frontend/components/pages/_routes.ts:23](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/components/pages/_routes.ts#L23)

___

### routeHelpers

• `Const` **routeHelpers**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `createModifyProductUrl` | (`productName`: `string`) => `string` |
| `createProductsDashboardQueryUpdater` | (`currentQueryParams`: `ParsedQuery`<`string`\>, `pathname`: `string`, `history`: `History`<`unknown`\>) => (`updates`: ``null`` \| { `[key: string]`: `string` \| `number` \| `boolean`;  }) => `void` |
| `extractProductUrlFromPathname` | (`pathname`: `string`) => `string` |
| `parseSearchParams` | (`search`: `string`) => `ParsedQuery`<`string` \| `number` \| `boolean`\> |
| `stringifySearchParams` | (`payload`: `Record`<`string`, `unknown`\>) => `string` |

#### Defined in

[src/frontend/components/pages/_routes.ts:64](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/components/pages/_routes.ts#L64)

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

[src/frontend/components/pages/_routes.ts:99](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/components/pages/_routes.ts#L99)

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

[src/frontend/components/utils/bodyObserver.tsx:7](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/components/utils/bodyObserver.tsx#L7)

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

[src/frontend/components/utils/bodyObserver.tsx:26](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/components/utils/bodyObserver.tsx#L26)

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

[src/frontend/components/utils/bodyObserver.tsx:36](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/components/utils/bodyObserver.tsx#L36)

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

[src/frontend/components/utils/flexibleList.jsx:72](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/components/utils/flexibleList.jsx#L72)

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

[src/frontend/components/utils/pagination.jsx:20](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/components/utils/pagination.jsx#L20)

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
- [PEVLegend](#pevlegend)
- [PEVLink](#pevlink)
- [PEVParagraph](#pevparagraph)
- [PEVRadio](#pevradio)
- [PEVTabs](#pevtabs)

### Functions

- [PEVFormFieldError](#pevformfielderror)
- [PEVTextField](#pevtextfield)

## Variables

### PEVButton

• `Const` **PEVButton**: `ForwardRefExoticComponent`<`RefAttributes`<`any`\>\>

#### Defined in

[src/frontend/components/utils/pevElements.jsx:44](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/components/utils/pevElements.jsx#L44)

___

### PEVCheckbox

• `Const` **PEVCheckbox**: `ForwardRefExoticComponent`<`RefAttributes`<`any`\>\>

#### Defined in

[src/frontend/components/utils/pevElements.jsx:177](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/components/utils/pevElements.jsx#L177)

___

### PEVFieldset

• `Const` **PEVFieldset**: `ForwardRefExoticComponent`<`RefAttributes`<`any`\>\>

#### Defined in

[src/frontend/components/utils/pevElements.jsx:86](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/components/utils/pevElements.jsx#L86)

___

### PEVForm

• `Const` **PEVForm**: `ForwardRefExoticComponent`<`RefAttributes`<`any`\>\>

#### Defined in

[src/frontend/components/utils/pevElements.jsx:185](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/components/utils/pevElements.jsx#L185)

___

### PEVHeading

• `Const` **PEVHeading**: `ForwardRefExoticComponent`<`RefAttributes`<`any`\>\>

#### Defined in

[src/frontend/components/utils/pevElements.jsx:220](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/components/utils/pevElements.jsx#L220)

___

### PEVIconButton

• `Const` **PEVIconButton**: `ForwardRefExoticComponent`<`RefAttributes`<`any`\>\>

#### Defined in

[src/frontend/components/utils/pevElements.jsx:62](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/components/utils/pevElements.jsx#L62)

___

### PEVLegend

• `Const` **PEVLegend**: `ForwardRefExoticComponent`<`RefAttributes`<`any`\>\>

#### Defined in

[src/frontend/components/utils/pevElements.jsx:94](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/components/utils/pevElements.jsx#L94)

___

### PEVLink

• `Const` **PEVLink**: `ForwardRefExoticComponent`<`RefAttributes`<`any`\>\>

#### Defined in

[src/frontend/components/utils/pevElements.jsx:78](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/components/utils/pevElements.jsx#L78)

___

### PEVParagraph

• `Const` **PEVParagraph**: `ForwardRefExoticComponent`<`RefAttributes`<`any`\>\>

#### Defined in

[src/frontend/components/utils/pevElements.jsx:234](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/components/utils/pevElements.jsx#L234)

___

### PEVRadio

• `Const` **PEVRadio**: `ForwardRefExoticComponent`<`RefAttributes`<`any`\>\>

#### Defined in

[src/frontend/components/utils/pevElements.jsx:181](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/components/utils/pevElements.jsx#L181)

___

### PEVTabs

• `Const` **PEVTabs**: `ForwardRefExoticComponent`<`RefAttributes`<`any`\>\>

#### Defined in

[src/frontend/components/utils/pevElements.jsx:282](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/components/utils/pevElements.jsx#L282)

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

[src/frontend/components/utils/pevElements.jsx:216](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/components/utils/pevElements.jsx#L216)

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

[src/frontend/components/utils/pevElements.jsx:102](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/components/utils/pevElements.jsx#L102)

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

[src/frontend/components/utils/popup.jsx:57](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/components/utils/popup.jsx#L57)

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

[src/frontend/components/utils/popup.jsx:16](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/components/utils/popup.jsx#L16)

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

[src/frontend/components/utils/popup.jsx:92](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/components/utils/popup.jsx#L92)

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

[src/frontend/components/utils/popup.jsx:25](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/components/utils/popup.jsx#L25)

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

[src/frontend/components/utils/ratingWidget.jsx:17](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/components/utils/ratingWidget.jsx#L17)

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

[src/frontend/components/utils/scroller.jsx:94](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/components/utils/scroller.jsx#L94)

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

[src/frontend/contexts/rwd-layout.tsx:79](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/contexts/rwd-layout.tsx#L79)

___

### useRWDLayout

▸ **useRWDLayout**(): `Object`

#### Returns

`Object`

#### Defined in

[src/frontend/contexts/rwd-layout.tsx:83](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/contexts/rwd-layout.tsx#L83)

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
- [IOrder](#interfacesfeatures_httpservice_internal_iordermd)

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

[src/middleware/helpers/api-products-specs-mapper.ts:4](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/middleware/helpers/api-products-specs-mapper.ts#L4)

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

[src/middleware/helpers/api-products-specs-mapper.ts:8](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/middleware/helpers/api-products-specs-mapper.ts#L8)

___

### TPagination

Ƭ **TPagination**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `pageNumber` | `number` |
| `productsPerPage` | `number` |

#### Defined in

[commons/types.ts:81](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/commons/types.ts#L81)

___

### TProductTechnicalSpecs

Ƭ **TProductTechnicalSpecs**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `categoryToSpecs` | `Record`<`string`, `string`[]\> |
| `specs` | [`TOutputSpecs`](#toutputspecs)[] |

#### Defined in

[src/middleware/helpers/api-products-specs-mapper.ts:13](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/middleware/helpers/api-products-specs-mapper.ts#L13)

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

[src/frontend/features/httpService.ts:531](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L531)

___

### TUserRegistrationCredentials

Ƭ **TUserRegistrationCredentials**: `Pick`<`IUser`, ``"login"`` \| ``"password"`` \| ``"email"``\> & { `repeatedPassword`: `IUser`[``"password"``]  }

#### Defined in

[src/database/models/_user.ts:285](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/database/models/_user.ts#L285)

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

[src/frontend/features/httpService.ts:562](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L562)

___

### httpService

• **httpService**: [`HttpService`](#classesfeatures_httpservice_internal_httpservicemd)

#### Defined in

[src/frontend/features/httpService.ts:576](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L576)

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

[src/frontend/features/httpService.ts:526](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/httpService.ts#L526)

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

[src/frontend/features/storageService.ts:9](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storageService.ts#L9)

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

[src/frontend/features/storageService.ts:14](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storageService.ts#L14)

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

[src/frontend/features/storeService.ts:177](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storeService.ts#L177)

## Variables

### storeService

• `Const` **storeService**: [`StoreService`](#classescomponents_pages__routes_internal_storeservicemd)

#### Defined in

[src/frontend/features/storeService.ts:169](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/storeService.ts#L169)

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

[src/frontend/features/userSessionService.ts:12](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/9a4d1fa/src/frontend/features/userSessionService.ts#L12)
