fake-pev-shopping

# fake-pev-shopping

## Table of contents

### Modules

- [features/auth](#modulesfeatures_authmd)
- [helpers/mailer](#moduleshelpers_mailermd)
- [helpers/middleware-error-handler](#moduleshelpers_middleware_error_handlermd)
- [helpers/middleware-response-wrapper](#moduleshelpers_middleware_response_wrappermd)
- [routes/api-config](#modulesroutes_api_configmd)
- [routes/api-orders](#modulesroutes_api_ordersmd)
- [routes/api-product-categories](#modulesroutes_api_product_categoriesmd)
- [routes/api-products](#modulesroutes_api_productsmd)
- [routes/api-user-roles](#modulesroutes_api_user_rolesmd)
- [routes/api-users](#modulesroutes_api_usersmd)

[fake-pev-shopping](#readmemd) / [helpers/middleware-response-wrapper](#moduleshelpers_middleware_response_wrappermd) / IEmbracedResponse

# Interface: IEmbracedResponse<PayloadType\>

[helpers/middleware-response-wrapper](#moduleshelpers_middleware_response_wrappermd).IEmbracedResponse

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

[src/middleware/helpers/middleware-response-wrapper.ts:11](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/helpers/middleware-response-wrapper.ts#L11)

___

### error

• **error**: `string`

#### Defined in

[src/middleware/helpers/middleware-response-wrapper.ts:14](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/helpers/middleware-response-wrapper.ts#L14)

___

### exception

• **exception**: `Error` \| { `message`: `string` ; `stack?`: `string`  }

#### Defined in

[src/middleware/helpers/middleware-response-wrapper.ts:15](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/helpers/middleware-response-wrapper.ts#L15)

___

### message

• **message**: `string`

#### Defined in

[src/middleware/helpers/middleware-response-wrapper.ts:13](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/helpers/middleware-response-wrapper.ts#L13)

___

### payload

• **payload**: `PayloadType` \| `unknown`[] \| `Record`<`string`, `unknown`\>

#### Defined in

[src/middleware/helpers/middleware-response-wrapper.ts:12](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/helpers/middleware-response-wrapper.ts#L12)

[fake-pev-shopping](#readmemd) / [routes/api-users](#modulesroutes_api_usersmd) / [<internal\>](#modulesroutes_api_users_internal_md) / IProduct

# Interface: IProduct

[routes/api-users](#modulesroutes_api_usersmd).[<internal>](#modulesroutes_api_users_internal_md).IProduct

## Hierarchy

- `Document`

  ↳ **`IProduct`**

## Table of contents

### Properties

- [category](#category)
- [images](#images)
- [name](#name)
- [price](#price)
- [relatedProductsNames](#relatedproductsnames)
- [reviews](#reviews)
- [shortDescription](#shortdescription)
- [technicalSpecs](#technicalspecs)
- [url](#url)

### Methods

- [prepareUrlField](#prepareurlfield)
- [transformImagesToImagePaths](#transformimagestoimagepaths)

## Properties

### category

• **category**: `string`

#### Defined in

[src/database/models/_product.ts:364](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/database/models/_product.ts#L364)

___

### images

• **images**: { `name`: `string` ; `src`: `string`  }[]

#### Defined in

[src/database/models/_product.ts:372](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/database/models/_product.ts#L372)

___

### name

• **name**: `string`

#### Defined in

[src/database/models/_product.ts:362](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/database/models/_product.ts#L362)

___

### price

• **price**: `number`

#### Defined in

[src/database/models/_product.ts:365](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/database/models/_product.ts#L365)

___

### relatedProductsNames

• **relatedProductsNames**: `string`[]

#### Defined in

[src/database/models/_product.ts:373](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/database/models/_product.ts#L373)

___

### reviews

• **reviews**: `IReviews`

#### Defined in

[src/database/models/_product.ts:374](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/database/models/_product.ts#L374)

___

### shortDescription

• **shortDescription**: `string`[]

#### Defined in

[src/database/models/_product.ts:366](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/database/models/_product.ts#L366)

___

### technicalSpecs

• **technicalSpecs**: { `data`: `unknown` ; `defaultUnit`: `string` ; `heading`: `string`  }[]

#### Defined in

[src/database/models/_product.ts:367](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/database/models/_product.ts#L367)

___

### url

• **url**: `string`

#### Defined in

[src/database/models/_product.ts:363](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/database/models/_product.ts#L363)

## Methods

### prepareUrlField

▸ **prepareUrlField**(): `void`

#### Returns

`void`

#### Defined in

[src/database/models/_product.ts:376](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/database/models/_product.ts#L376)

___

### transformImagesToImagePaths

▸ **transformImagesToImagePaths**(): `void`

#### Returns

`void`

#### Defined in

[src/database/models/_product.ts:377](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/database/models/_product.ts#L377)

[fake-pev-shopping](#readmemd) / [features/auth](#modulesfeatures_authmd) / <internal\>

# Namespace: <internal\>

[features/auth](#modulesfeatures_authmd).<internal>

[fake-pev-shopping](#readmemd) / features/auth

# Module: features/auth

## Table of contents

### Namespaces

- [&lt;internal\&gt;](#modulesfeatures_auth_internal_md)

### Functions

- [authMiddlewareFn](#authmiddlewarefn)
- [authToPayU](#authtopayu)
- [comparePasswords](#comparepasswords)
- [getToken](#gettoken)
- [hashPassword](#hashpassword)
- [userRoleMiddlewareFn](#userrolemiddlewarefn)
- [verifyToken](#verifytoken)

## Functions

### authMiddlewareFn

▸ **authMiddlewareFn**(`req`, `res`, `next`): `Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |
| `res` | `Response`<`any`, `Record`<`string`, `any`\>\> |
| `next` | `NextFunction` |

#### Returns

`Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Defined in

[src/middleware/features/auth.ts:38](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/features/auth.ts#L38)

___

### authToPayU

▸ **authToPayU**(): `Promise`<`string` \| `Error`\>

#### Returns

`Promise`<`string` \| `Error`\>

#### Defined in

[src/middleware/features/auth.ts:96](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/features/auth.ts#L96)

___

### comparePasswords

▸ **comparePasswords**(`password`, `passwordPattern`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `password` | `string` |
| `passwordPattern` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[src/middleware/features/auth.ts:22](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/features/auth.ts#L22)

___

### getToken

▸ **getToken**(`payloadObj`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `payloadObj` | `TToken` |

#### Returns

`string`

#### Defined in

[src/middleware/features/auth.ts:30](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/features/auth.ts#L30)

___

### hashPassword

▸ **hashPassword**(`password`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `password` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[src/middleware/features/auth.ts:26](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/features/auth.ts#L26)

___

### userRoleMiddlewareFn

▸ **userRoleMiddlewareFn**(`roleName`): (`req`: `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\>, `res`: `Response`<`any`, `Record`<`string`, `any`\>\>, `next`: `NextFunction`) => `Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `roleName` | ``"client"`` \| ``"seller"`` |

#### Returns

`fn`

▸ (`req`, `res`, `next`): `Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |
| `res` | `Response`<`any`, `Record`<`string`, `any`\>\> |
| `next` | `NextFunction` |

##### Returns

`Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Defined in

[src/middleware/features/auth.ts:80](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/features/auth.ts#L80)

___

### verifyToken

▸ **verifyToken**(`token`): `TToken`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | `string` |

#### Returns

`TToken`

#### Defined in

[src/middleware/features/auth.ts:34](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/features/auth.ts#L34)

[fake-pev-shopping](#readmemd) / helpers/mailer

# Module: helpers/mailer

## Table of contents

### Variables

- [EMAIL\_TYPES](#email_types)

### Functions

- [sendMail](#sendmail)

## Variables

### EMAIL\_TYPES

• `Const` **EMAIL\_TYPES**: `Record`<``"ACTIVATION"`` \| ``"RESET_PASSWORD"``, ``"ACTIVATION"`` \| ``"RESET_PASSWORD"``\>

#### Defined in

[src/middleware/helpers/mailer.ts:51](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/helpers/mailer.ts#L51)

## Functions

### sendMail

▸ **sendMail**(`receiver`, `emailType`, `link`): `Promise`<`SendmailTransport.SentMessageInfo`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `receiver` | `string` |
| `emailType` | ``"ACTIVATION"`` \| ``"RESET_PASSWORD"`` |
| `link` | `string` |

#### Returns

`Promise`<`SendmailTransport.SentMessageInfo`\>

#### Defined in

[src/middleware/helpers/mailer.ts:55](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/helpers/mailer.ts#L55)

[fake-pev-shopping](#readmemd) / [helpers/middleware-error-handler](#moduleshelpers_middleware_error_handlermd) / <internal\>

# Namespace: <internal\>

[helpers/middleware-error-handler](#moduleshelpers_middleware_error_handlermd).<internal>

## Table of contents

### Type Aliases

- [TMiddlewareErrorHandler](#tmiddlewareerrorhandler)

## Type Aliases

### TMiddlewareErrorHandler

Ƭ **TMiddlewareErrorHandler**: (`error`: `Error`, `req`: `Request`, `res`: `Response`) => `Pick`<`Response`, ``"json"``\>

#### Type declaration

▸ (`error`, `req`, `res`): `Pick`<`Response`, ``"json"``\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `Error` |
| `req` | `Request` |
| `res` | `Response` |

##### Returns

`Pick`<`Response`, ``"json"``\>

#### Defined in

[src/middleware/helpers/middleware-error-handler.ts:10](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/helpers/middleware-error-handler.ts#L10)

[fake-pev-shopping](#readmemd) / helpers/middleware-error-handler

# Module: helpers/middleware-error-handler

## Table of contents

### Namespaces

- [&lt;internal\&gt;](#moduleshelpers_middleware_error_handler_internal_md)

### Functions

- [getMiddlewareErrorHandler](#getmiddlewareerrorhandler)

## Functions

### getMiddlewareErrorHandler

▸ **getMiddlewareErrorHandler**(`logger`): [`TMiddlewareErrorHandler`](#tmiddlewareerrorhandler)

#### Parameters

| Name | Type |
| :------ | :------ |
| `logger` | `Logger` |

#### Returns

[`TMiddlewareErrorHandler`](#tmiddlewareerrorhandler)

#### Defined in

[src/middleware/helpers/middleware-error-handler.ts:14](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/helpers/middleware-error-handler.ts#L14)

[fake-pev-shopping](#readmemd) / [helpers/middleware-response-wrapper](#moduleshelpers_middleware_response_wrappermd) / <internal\>

# Namespace: <internal\>

[helpers/middleware-response-wrapper](#moduleshelpers_middleware_response_wrappermd).<internal>

## Table of contents

### Enumeration Members

- [NOT\_FOUND](#not_found)
- [NO\_CONTENT](#no_content)

### Variables

- [GROUPED\_HTTP\_STATUS\_CODES](#grouped_http_status_codes)

## Enumeration Members

### NOT\_FOUND

• **NOT\_FOUND**: ``404``

#### Defined in

[commons/types.ts:45](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/commons/types.ts#L45)

___

### NO\_CONTENT

• **NO\_CONTENT**: ``204``

#### Defined in

[commons/types.ts:39](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/commons/types.ts#L39)

## Variables

### GROUPED\_HTTP\_STATUS\_CODES

• `Const` **GROUPED\_HTTP\_STATUS\_CODES**: `Readonly`<{ `CLIENT_ERROR`: { `400`: ``400`` = 400; `401`: ``401`` = 401; `403`: ``403`` = 403; `404`: ``404`` = 404; `409`: ``409`` = 409 } ; `SERVER_ERROR`: { `500`: ``500`` = 500; `503`: ``503`` = 503; `511`: ``511`` = 511 } ; `SUCCESSFUL`: { `200`: ``200`` = 200; `201`: ``201`` = 201; `204`: ``204`` = 204 }  }\>

#### Defined in

[src/middleware/helpers/middleware-response-wrapper.ts:19](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/helpers/middleware-response-wrapper.ts#L19)

[fake-pev-shopping](#readmemd) / helpers/middleware-response-wrapper

# Module: helpers/middleware-response-wrapper

Custom wrapper to secure consistent usage of a few [`Express#res`](https://expressjs.com/en/4x/api.html#res) methods.

## Table of contents

### Namespaces

- [&lt;internal\&gt;](#moduleshelpers_middleware_response_wrapper_internal_md)

### Interfaces

- [IEmbracedResponse](#interfaceshelpers_middleware_response_wrapperiembracedresponsemd)

### Type Aliases

- [TClientErrorHTTPStatusCodesToData](#tclienterrorhttpstatuscodestodata)
- [TServerErrorHTTPStatusCodesToData](#tservererrorhttpstatuscodestodata)
- [TSuccessfulHTTPStatusCodesToData](#tsuccessfulhttpstatuscodestodata)
- [TypeOfHTTPStatusCodes](#typeofhttpstatuscodes)

### Functions

- [wrapRes](#wrapres)

## Type Aliases

### TClientErrorHTTPStatusCodesToData

Ƭ **TClientErrorHTTPStatusCodesToData**: { [ClientErrorStatus in keyof TypeOfHTTPStatusCodes["CLIENT\_ERROR"]]: Extract<keyof IEmbracedResponse, "error"\> }

#### Defined in

[src/middleware/helpers/middleware-response-wrapper.ts:62](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/helpers/middleware-response-wrapper.ts#L62)

___

### TServerErrorHTTPStatusCodesToData

Ƭ **TServerErrorHTTPStatusCodesToData**: { [ServerErrorStatus in keyof TypeOfHTTPStatusCodes["SERVER\_ERROR"]]: Extract<keyof IEmbracedResponse, "exception"\> }

#### Defined in

[src/middleware/helpers/middleware-response-wrapper.ts:65](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/helpers/middleware-response-wrapper.ts#L65)

___

### TSuccessfulHTTPStatusCodesToData

Ƭ **TSuccessfulHTTPStatusCodesToData**: { [SuccessfulStatus in keyof TypeOfHTTPStatusCodes["SUCCESSFUL"]]: Extract<keyof IEmbracedResponse, "payload" \| "message" \| "authToken"\> }

#### Defined in

[src/middleware/helpers/middleware-response-wrapper.ts:56](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/helpers/middleware-response-wrapper.ts#L56)

___

### TypeOfHTTPStatusCodes

Ƭ **TypeOfHTTPStatusCodes**: typeof [`GROUPED_HTTP_STATUS_CODES`](#grouped_http_status_codes)

#### Defined in

[src/middleware/helpers/middleware-response-wrapper.ts:39](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/helpers/middleware-response-wrapper.ts#L39)

## Functions

### wrapRes

▸ **wrapRes**(`res`, `status`): `Response`

It asserts that used `HTTP_STATUS_CODE` is adequate to provided optional payload shape (regarding it's key/label).

**`example`** Without payload
```ts
wrapRes(res, HTTP_STATUS_CODE.NO_CONTENT);
```

**`example`** With payload
```ts
wrapRes(res, HTTP_STATUS_CODE.OK, { payload: someResourceValue });
wrapRes(res, HTTP_STATUS_CODE.CREATED, { message: 'Resource created!' });
wrapRes(res, HTTP_STATUS_CODE.NOT_FOUND, { error: 'Resource not found!' });
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `res` | `Response`<`any`, `Record`<`string`, `any`\>\> |
| `status` | [`NO_CONTENT`](#no_content) \| [`NOT_FOUND`](#not_found) |

#### Returns

`Response`

#### Defined in

[src/middleware/helpers/middleware-response-wrapper.ts:83](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/helpers/middleware-response-wrapper.ts#L83)

▸ **wrapRes**<`Payload`, `Status`, `DataKey`\>(`res`, `status`, `data`): `Response`

It asserts that used `HTTP_STATUS_CODE` is adequate to provided optional payload shape (regarding it's key/label).

**`example`** Without payload
```ts
wrapRes(res, HTTP_STATUS_CODE.NO_CONTENT);
```

**`example`** With payload
```ts
wrapRes(res, HTTP_STATUS_CODE.OK, { payload: someResourceValue });
wrapRes(res, HTTP_STATUS_CODE.CREATED, { message: 'Resource created!' });
wrapRes(res, HTTP_STATUS_CODE.NOT_FOUND, { error: 'Resource not found!' });
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Payload` | `Payload` |
| `Status` | extends ``200`` \| ``201`` \| ``400`` \| ``401`` \| ``403`` \| ``404`` \| ``409`` \| ``500`` \| ``503`` \| ``511`` |
| `DataKey` | extends ``"error"`` \| ``"authToken"`` \| ``"payload"`` \| ``"message"`` \| ``"exception"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `res` | `Response`<`any`, `Record`<`string`, `any`\>\> |
| `status` | `Status` |
| `data` | `Record`<`DataKey`, [`IEmbracedResponse`](#interfaceshelpers_middleware_response_wrapperiembracedresponsemd)<`never`\>[`DataKey`]\> |

#### Returns

`Response`

#### Defined in

[src/middleware/helpers/middleware-response-wrapper.ts:87](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/helpers/middleware-response-wrapper.ts#L87)

[fake-pev-shopping](#readmemd) / [routes/api-config](#modulesroutes_api_configmd) / <internal\>

# Namespace: <internal\>

[routes/api-config](#modulesroutes_api_configmd).<internal>

## Table of contents

### Functions

- [populateDB](#populatedb)

## Functions

### populateDB

▸ **populateDB**(`req`, `res`, `next`): `Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |
| `res` | `Response`<`any`, `Record`<`string`, `any`\>\> |
| `next` | `NextFunction` |

#### Returns

`Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Defined in

[src/middleware/routes/api-config.ts:22](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/routes/api-config.ts#L22)

[fake-pev-shopping](#readmemd) / routes/api-config

# Module: routes/api-config

## Table of contents

### Namespaces

- [&lt;internal\&gt;](#modulesroutes_api_config_internal_md)

### Variables

- [router](#router)

## Variables

### router

• `Const` **router**: `Router` & `Partial`<{ `_populateDB`: typeof [`populateDB`](#populatedb)  }\>

#### Defined in

[src/middleware/routes/api-config.ts:14](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/routes/api-config.ts#L14)

[fake-pev-shopping](#readmemd) / [routes/api-orders](#modulesroutes_api_ordersmd) / <internal\>

# Namespace: <internal\>

[routes/api-orders](#modulesroutes_api_ordersmd).<internal>

## Table of contents

### Functions

- [handleOrderPreflight](#handleorderpreflight)
- [makeOrder](#makeorder)

## Functions

### handleOrderPreflight

▸ **handleOrderPreflight**(`req`, `res`): `Response`<`any`, `Record`<`string`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |
| `res` | `Response`<`any`, `Record`<`string`, `any`\>\> |

#### Returns

`Response`<`any`, `Record`<`string`, `any`\>\>

#### Defined in

[src/middleware/routes/api-orders.ts:36](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/routes/api-orders.ts#L36)

___

### makeOrder

▸ **makeOrder**(`req`, `res`, `next`): `Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |
| `res` | `Response`<`any`, `Record`<`string`, `any`\>\> |
| `next` | `NextFunction` |

#### Returns

`Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Defined in

[src/middleware/routes/api-orders.ts:45](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/routes/api-orders.ts#L45)

[fake-pev-shopping](#readmemd) / routes/api-orders

# Module: routes/api-orders

## Table of contents

### Namespaces

- [&lt;internal\&gt;](#modulesroutes_api_orders_internal_md)

### Variables

- [router](#router)

## Variables

### router

• `Const` **router**: `Router` & `Partial`<{ `_handleOrderPreflight`: typeof [`handleOrderPreflight`](#handleorderpreflight) ; `_makeOrder`: typeof [`makeOrder`](#makeorder)  }\>

#### Defined in

[src/middleware/routes/api-orders.ts:17](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/routes/api-orders.ts#L17)

[fake-pev-shopping](#readmemd) / routes/api-product-categories

# Module: routes/api-product-categories

## Table of contents

### Variables

- [router](#router)

## Variables

### router

• `Const` **router**: `Router`

#### Defined in

[src/middleware/routes/api-product-categories.ts:14](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/routes/api-product-categories.ts#L14)

[fake-pev-shopping](#readmemd) / [routes/api-products](#modulesroutes_api_productsmd) / [<internal\>](#modulesroutes_api_products_internal_md) / addReview

# Namespace: addReview

[routes/api-products](#modulesroutes_api_productsmd).[<internal>](#modulesroutes_api_products_internal_md).addReview

## Table of contents

### Functions

- [isIntOrDecimalHalf](#isintordecimalhalf)
- [isNumber](#isnumber)

## Functions

### isIntOrDecimalHalf

▸ **isIntOrDecimalHalf**(`value`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`boolean`

#### Defined in

[src/middleware/routes/api-products.ts:288](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/routes/api-products.ts#L288)

___

### isNumber

▸ **isNumber**(`value`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `unknown` |

#### Returns

`boolean`

#### Defined in

[src/middleware/routes/api-products.ts:287](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/routes/api-products.ts#L287)

[fake-pev-shopping](#readmemd) / [routes/api-products](#modulesroutes_api_productsmd) / <internal\>

# Namespace: <internal\>

[routes/api-products](#modulesroutes_api_productsmd).<internal>

## Table of contents

### Namespaces

- [addReview](#modulesroutes_api_products_internal_addreviewmd)

### Functions

- [addProduct](#addproduct)
- [addReview](#addreview)
- [deleteProduct](#deleteproduct)
- [getProductById](#getproductbyid)
- [getProducts](#getproducts)
- [modifyProduct](#modifyproduct)

## Functions

### addProduct

▸ **addProduct**(`req`, `res`, `next`): `Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |
| `res` | `Response`<`any`, `Record`<`string`, `any`\>\> |
| `next` | `NextFunction` |

#### Returns

`Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Defined in

[src/middleware/routes/api-products.ts:163](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/routes/api-products.ts#L163)

___

### addReview

▸ **addReview**(`req`, `res`, `next`): `Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |
| `res` | `Response`<`any`, `Record`<`string`, `any`\>\> |
| `next` | `NextFunction` |

#### Returns

`Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Defined in

[src/middleware/routes/api-products.ts:219](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/routes/api-products.ts#L219)

___

### deleteProduct

▸ **deleteProduct**(`req`, `res`, `next`): `Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |
| `res` | `Response`<`any`, `Record`<`string`, `any`\>\> |
| `next` | `NextFunction` |

#### Returns

`Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Defined in

[src/middleware/routes/api-products.ts:322](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/routes/api-products.ts#L322)

___

### getProductById

▸ **getProductById**(`req`, `res`, `next`): `Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |
| `res` | `Response`<`any`, `Record`<`string`, `any`\>\> |
| `next` | `NextFunction` |

#### Returns

`Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Defined in

[src/middleware/routes/api-products.ts:143](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/routes/api-products.ts#L143)

___

### getProducts

▸ **getProducts**(`req`, `res`, `next`): `Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |
| `res` | `Response`<`any`, `Record`<`string`, `any`\>\> |
| `next` | `NextFunction` |

#### Returns

`Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Defined in

[src/middleware/routes/api-products.ts:80](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/routes/api-products.ts#L80)

___

### modifyProduct

▸ **modifyProduct**(`req`, `res`, `next`): `Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |
| `res` | `Response`<`any`, `Record`<`string`, `any`\>\> |
| `next` | `NextFunction` |

#### Returns

`Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Defined in

[src/middleware/routes/api-products.ts:295](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/routes/api-products.ts#L295)

[fake-pev-shopping](#readmemd) / routes/api-products

# Module: routes/api-products

## Table of contents

### Namespaces

- [&lt;internal\&gt;](#modulesroutes_api_products_internal_md)

### Variables

- [router](#router)

## Variables

### router

• `Const` **router**: `Router` & `Partial`<{ `_addProduct`: typeof [`addProduct`](#addproduct) ; `_addReview`: typeof [`addReview`](#addreview) ; `_deleteProduct`: typeof [`deleteProduct`](#deleteproduct) ; `_getProductById`: typeof [`getProductById`](#getproductbyid) ; `_getProducts`: typeof [`getProducts`](#getproducts) ; `_modifyProduct`: typeof [`modifyProduct`](#modifyproduct)  }\>

#### Defined in

[src/middleware/routes/api-products.ts:18](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/routes/api-products.ts#L18)

[fake-pev-shopping](#readmemd) / [routes/api-user-roles](#modulesroutes_api_user_rolesmd) / <internal\>

# Namespace: <internal\>

[routes/api-user-roles](#modulesroutes_api_user_rolesmd).<internal>

## Table of contents

### Type Aliases

- [TMiddlewareFn](#tmiddlewarefn)

## Type Aliases

### TMiddlewareFn

Ƭ **TMiddlewareFn**: (`req`: `Request`, `res`: `Response`, `next`: `NextFunction`) => `Promise`<`void` \| `Response`\>

#### Type declaration

▸ (`req`, `res`, `next`): `Promise`<`void` \| `Response`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request` |
| `res` | `Response` |
| `next` | `NextFunction` |

##### Returns

`Promise`<`void` \| `Response`\>

#### Defined in

[src/middleware/routes/api-user-roles.ts:13](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/routes/api-user-roles.ts#L13)

[fake-pev-shopping](#readmemd) / routes/api-user-roles

# Module: routes/api-user-roles

## Table of contents

### Namespaces

- [&lt;internal\&gt;](#modulesroutes_api_user_roles_internal_md)

### Variables

- [router](#router)

## Variables

### router

• `Const` **router**: `Router` & `Partial`<{ `_getUserRoles`: [`TMiddlewareFn`](#tmiddlewarefn)  }\>

#### Defined in

[src/middleware/routes/api-user-roles.ts:16](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/routes/api-user-roles.ts#L16)

[fake-pev-shopping](#readmemd) / [routes/api-users](#modulesroutes_api_usersmd) / <internal\>

# Namespace: <internal\>

[routes/api-users](#modulesroutes_api_usersmd).<internal>

## Table of contents

### Interfaces

- [IProduct](#interfacesroutes_api_users_internal_iproductmd)

### Type Aliases

- [TUserPublic](#tuserpublic)

### Functions

- [addProductToObserved](#addproducttoobserved)
- [changePassword](#changepassword)
- [confirmRegistration](#confirmregistration)
- [deleteUser](#deleteuser)
- [getObservedProducts](#getobservedproducts)
- [getUser](#getuser)
- [logInUser](#loginuser)
- [logOutUser](#logoutuser)
- [logOutUserFromSessions](#logoutuserfromsessions)
- [registerUser](#registeruser)
- [removeAllProductsFromObserved](#removeallproductsfromobserved)
- [removeProductFromObserved](#removeproductfromobserved)
- [resendConfirmRegistration](#resendconfirmregistration)
- [resendResetPassword](#resendresetpassword)
- [resetPassword](#resetpassword)
- [setNewPassword](#setnewpassword)
- [updateUser](#updateuser)

## Type Aliases

### TUserPublic

Ƭ **TUserPublic**: `Pick`<`IUser`, ``"login"`` \| ``"email"`` \| ``"observedProductsIDs"``\> & { `_id`: `Schema.Types.ObjectId` ; `accountType`: `NonNullable`<`IUser`[``"accountType"``]\>[``"roleName"``]  }

#### Defined in

[src/database/models/_user.ts:242](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/database/models/_user.ts#L242)

## Functions

### addProductToObserved

▸ **addProductToObserved**(`req`, `res`, `next`): `Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |
| `res` | `Response`<`any`, `Record`<`string`, `any`\>\> |
| `next` | `NextFunction` |

#### Returns

`Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Defined in

[src/middleware/routes/api-users.ts:519](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/routes/api-users.ts#L519)

___

### changePassword

▸ **changePassword**(`req`, `res`, `next`): `Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |
| `res` | `Response`<`any`, `Record`<`string`, `any`\>\> |
| `next` | `NextFunction` |

#### Returns

`Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Defined in

[src/middleware/routes/api-users.ts:368](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/routes/api-users.ts#L368)

___

### confirmRegistration

▸ **confirmRegistration**(`req`, `res`, `next`): `Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |
| `res` | `Response`<`any`, `Record`<`string`, `any`\>\> |
| `next` | `NextFunction` |

#### Returns

`Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Defined in

[src/middleware/routes/api-users.ts:266](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/routes/api-users.ts#L266)

___

### deleteUser

▸ **deleteUser**(`req`, `res`, `next`): `Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |
| `res` | `Response`<`any`, `Record`<`string`, `any`\>\> |
| `next` | `NextFunction` |

#### Returns

`Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Defined in

[src/middleware/routes/api-users.ts:610](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/routes/api-users.ts#L610)

___

### getObservedProducts

▸ **getObservedProducts**(`req`, `res`, `next`): `Promise`<``null`` \| `void` \| `any`[] \| `Response`<`any`, `Record`<`string`, `any`\>\> \| [`IProduct`](#interfacesroutes_api_users_internal_iproductmd) \| `IUser` \| `IUserRole` \| `PaginateResult`<[`IProduct`](#interfacesroutes_api_users_internal_iproductmd) \| `IUser` \| `IUserRole`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |
| `res` | `Response`<`any`, `Record`<`string`, `any`\>\> & { `_OMIT_HTTP?`: `boolean`  } |
| `next` | `NextFunction` |

#### Returns

`Promise`<``null`` \| `void` \| `any`[] \| `Response`<`any`, `Record`<`string`, `any`\>\> \| [`IProduct`](#interfacesroutes_api_users_internal_iproductmd) \| `IUser` \| `IUserRole` \| `PaginateResult`<[`IProduct`](#interfacesroutes_api_users_internal_iproductmd) \| `IUser` \| `IUserRole`\>\>

#### Defined in

[src/middleware/routes/api-users.ts:583](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/routes/api-users.ts#L583)

___

### getUser

▸ **getUser**(`req`, `res`, `next`): `Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |
| `res` | `Response`<`any`, `Record`<`string`, `any`\>\> |
| `next` | `NextFunction` |

#### Returns

`Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Defined in

[src/middleware/routes/api-users.ts:493](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/routes/api-users.ts#L493)

___

### logInUser

▸ **logInUser**(`req`, `res`, `next`): `Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |
| `res` | `Response`<`any`, `Record`<`string`, `any`\>\> |
| `next` | `NextFunction` |

#### Returns

`Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Defined in

[src/middleware/routes/api-users.ts:325](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/routes/api-users.ts#L325)

___

### logOutUser

▸ **logOutUser**(`req`, `res`, `next`): `Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |
| `res` | `Response`<`any`, `Record`<`string`, `any`\>\> |
| `next` | `NextFunction` |

#### Returns

`Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Defined in

[src/middleware/routes/api-users.ts:455](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/routes/api-users.ts#L455)

___

### logOutUserFromSessions

▸ **logOutUserFromSessions**(`req`, `res`, `next`): `Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |
| `res` | `Response`<`any`, `Record`<`string`, `any`\>\> |
| `next` | `NextFunction` |

#### Returns

`Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Defined in

[src/middleware/routes/api-users.ts:471](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/routes/api-users.ts#L471)

___

### registerUser

▸ **registerUser**(`req`, `res`, `next`): `Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |
| `res` | `Response`<`any`, `Record`<`string`, `any`\>\> |
| `next` | `NextFunction` |

#### Returns

`Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Defined in

[src/middleware/routes/api-users.ts:233](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/routes/api-users.ts#L233)

___

### removeAllProductsFromObserved

▸ **removeAllProductsFromObserved**(`req`, `res`, `next`): `Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |
| `res` | `Response`<`any`, `Record`<`string`, `any`\>\> |
| `next` | `NextFunction` |

#### Returns

`Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Defined in

[src/middleware/routes/api-users.ts:567](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/routes/api-users.ts#L567)

___

### removeProductFromObserved

▸ **removeProductFromObserved**(`req`, `res`, `next`): `Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |
| `res` | `Response`<`any`, `Record`<`string`, `any`\>\> |
| `next` | `NextFunction` |

#### Returns

`Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Defined in

[src/middleware/routes/api-users.ts:543](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/routes/api-users.ts#L543)

___

### resendConfirmRegistration

▸ **resendConfirmRegistration**(`req`, `res`, `next`): `Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |
| `res` | `Response`<`any`, `Record`<`string`, `any`\>\> |
| `next` | `NextFunction` |

#### Returns

`Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Defined in

[src/middleware/routes/api-users.ts:293](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/routes/api-users.ts#L293)

___

### resendResetPassword

▸ **resendResetPassword**(`req`, `res`, `next`): `Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |
| `res` | `Response`<`any`, `Record`<`string`, `any`\>\> |
| `next` | `NextFunction` |

#### Returns

`Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Defined in

[src/middleware/routes/api-users.ts:423](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/routes/api-users.ts#L423)

___

### resetPassword

▸ **resetPassword**(`req`, `res`, `next`): `Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |
| `res` | `Response`<`any`, `Record`<`string`, `any`\>\> |
| `next` | `NextFunction` |

#### Returns

`Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Defined in

[src/middleware/routes/api-users.ts:391](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/routes/api-users.ts#L391)

___

### setNewPassword

▸ **setNewPassword**(`req`, `res`, `next`): `Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |
| `res` | `Response`<`any`, `Record`<`string`, `any`\>\> |
| `next` | `NextFunction` |

#### Returns

`Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Defined in

[src/middleware/routes/api-users.ts:191](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/routes/api-users.ts#L191)

___

### updateUser

▸ **updateUser**(`req`, `res`, `next`): `Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |
| `res` | `Response`<`any`, `Record`<`string`, `any`\>\> |
| `next` | `NextFunction` |

#### Returns

`Promise`<`void` \| `Response`<`any`, `Record`<`string`, `any`\>\>\>

#### Defined in

[src/middleware/routes/api-users.ts:159](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/routes/api-users.ts#L159)

[fake-pev-shopping](#readmemd) / routes/api-users

# Module: routes/api-users

## Table of contents

### Namespaces

- [&lt;internal\&gt;](#modulesroutes_api_users_internal_md)

### Variables

- [router](#router)

## Variables

### router

• `Const` **router**: `Router` & `Partial`<{ `_addProductToObserved`: typeof [`addProductToObserved`](#addproducttoobserved) ; `_changePassword`: typeof [`changePassword`](#changepassword) ; `_confirmRegistration`: typeof [`confirmRegistration`](#confirmregistration) ; `_deleteUser`: typeof [`deleteUser`](#deleteuser) ; `_getObservedProducts`: typeof [`getObservedProducts`](#getobservedproducts) ; `_getUser`: typeof [`getUser`](#getuser) ; `_logInUser`: typeof [`logInUser`](#loginuser) ; `_logOutUser`: typeof [`logOutUser`](#logoutuser) ; `_logOutUserFromSessions`: typeof [`logOutUserFromSessions`](#logoutuserfromsessions) ; `_registerUser`: typeof [`registerUser`](#registeruser) ; `_removeAllProductsFromObserved`: typeof [`removeAllProductsFromObserved`](#removeallproductsfromobserved) ; `_removeProductFromObserved`: typeof [`removeProductFromObserved`](#removeproductfromobserved) ; `_resendConfirmRegistration`: typeof [`resendConfirmRegistration`](#resendconfirmregistration) ; `_resendResetPassword`: typeof [`resendResetPassword`](#resendresetpassword) ; `_resetPassword`: typeof [`resetPassword`](#resetpassword) ; `_setNewPassword`: typeof [`setNewPassword`](#setnewpassword) ; `_updateUser`: typeof [`updateUser`](#updateuser)  }\>

#### Defined in

[src/middleware/routes/api-users.ts:17](https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/2a742a8/src/middleware/routes/api-users.ts#L17)
