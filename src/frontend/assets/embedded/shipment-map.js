(() => {
    'use strict';

    /*
        Proxy for XHRs is rather useless, because request URL (which uniqueness is important for constructing LocalStorage key) 
        takes into account precise geo position, which may vary after even a slight map movement or zoom 
        from slighly different position
    */
    // setupXHRProxy();
    runGeoWidget();

    function setupXHRProxy() {
        const STORAGE_KEY_PREFIX = 'shipment-map-';

        const _open = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (...openArgs) {
            // console.log('(xhr open) openArgs:', openArgs);

            this._url = openArgs[1];

            _open.apply(this, openArgs);
        }

        let _onload = (...args) => {
            throw ReferenceError(
                `_onload proxy was not assigned before sending XHR! args: ${JSON.stringify(args)}`
            );
        };

        const _send = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function (...sendArgs) {
            const storageKey = `${STORAGE_KEY_PREFIX}${this._url}`;

            // console.log(
            //     '(xhr send) /this:', this,
            //     ' /url:', this.responseURL,
            //     ' /this._url:', this._url,
            //     ' /storageKey:', storageKey
            // );
            // console.warn(
            //     ' /[send] is in storage?', !!localStorage.getItem(storageKey)
            // );

            _onload = this.onload;
            this.onload = getOnLoadFn(storageKey);

            const valueFromStorage = localStorage.getItem(storageKey);

            if (valueFromStorage) {
                try {
                    // TODO: [BUG] _send error: TypeError: Cannot set property response of #<XMLHttpRequest> which has only a getter
                    this.response = valueFromStorage;
                } catch (error) {
                    console.error('_send error:', error);
                } finally {
                    _onload.call(this);
                }
            } else {
                _send.apply(this, sendArgs);
            }
        }

        const getOnLoadFn = (storageKey) =>
            async function onLoadFn(...onLoadArgs) {
                if (!this.response || this.response.type !== 'application/json') {
                    return _onload.apply(this, sendArgs);
                }

                try {
                    const resContent = await this.response.text();
                    // const resData = JSON.parse(resContent);

                    // console.log(
                    //     '(xhr onload) /this:', this,
                    //     ' /resData:', resData,
                    // );
                    // console.warn(
                    //     ' /[load] is in storage?', !!localStorage.getItem(storageKey)
                    // );

                    if (!localStorage.getItem(storageKey)) {
                        localStorage.setItem(storageKey, resContent);
                    }
                } catch (error) {
                    console.error('_onload error:', error);
                } finally {
                    _onload.apply(this, onLoadArgs);
                }
            };
    }

    function runGeoWidget() {
        window.easyPackAsyncInit = function () {
            easyPack.init({
                mapType: 'osm',
                searchType: 'osm',
            });

            const map = easyPack.mapWidget('easypack-map', function (point) {
                console.log('point:', point);
                window.parent.postMessage({ sender: 'shipment-map', point }, window.location.origin);
            });

            // window.addEventListener('message', function onMessage(event) {
            //   console.log('onMessage event:', event);
            // })
            window.parent.postMessage('hello from shipment-map', window.location.origin);
        };
    }
})();