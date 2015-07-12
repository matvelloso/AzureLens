// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.
///<reference path="typings/babylon.2.1.d.ts" />
///<reference path="typings/waa.d.ts" />
///<reference path="typings/jquery/jquery.d.ts" />
///<reference path="IAppView.ts" />
///<reference path="app3DView.ts" />
var BoxData = (function () {
    function BoxData() {
    }
    return BoxData;
})();
var CylinderData = (function () {
    function CylinderData() {
    }
    return CylinderData;
})();
var ObjectData = (function () {
    function ObjectData() {
    }
    return ObjectData;
})();
var ARROW_TYPE;
(function (ARROW_TYPE) {
    ARROW_TYPE[ARROW_TYPE["Simple"] = 0] = "Simple";
    ARROW_TYPE[ARROW_TYPE["ArrowTip"] = 1] = "ArrowTip";
    ARROW_TYPE[ARROW_TYPE["ArrowTipBothEnds"] = 2] = "ArrowTipBothEnds";
})(ARROW_TYPE || (ARROW_TYPE = {}));
var BOX2D_TYPE;
(function (BOX2D_TYPE) {
    BOX2D_TYPE[BOX2D_TYPE["BorderOnly"] = 0] = "BorderOnly";
    BOX2D_TYPE[BOX2D_TYPE["Filled"] = 1] = "Filled";
})(BOX2D_TYPE || (BOX2D_TYPE = {}));
var BOX_TYPE;
(function (BOX_TYPE) {
    BOX_TYPE[BOX_TYPE["VM"] = 0] = "VM";
    BOX_TYPE[BOX_TYPE["WebSite"] = 1] = "WebSite";
    BOX_TYPE[BOX_TYPE["O365"] = 2] = "O365";
    BOX_TYPE[BOX_TYPE["GitRepo"] = 3] = "GitRepo";
    BOX_TYPE[BOX_TYPE["GitHub"] = 4] = "GitHub";
    BOX_TYPE[BOX_TYPE["VSO"] = 5] = "VSO";
    BOX_TYPE[BOX_TYPE["MachineLearning"] = 6] = "MachineLearning";
    BOX_TYPE[BOX_TYPE["HDInsight"] = 7] = "HDInsight";
    BOX_TYPE[BOX_TYPE["StreamAnalytics"] = 8] = "StreamAnalytics";
    BOX_TYPE[BOX_TYPE["EventHubs"] = 9] = "EventHubs";
})(BOX_TYPE || (BOX_TYPE = {}));
var LOWBOX_TYPE;
(function (LOWBOX_TYPE) {
    LOWBOX_TYPE[LOWBOX_TYPE["Server"] = 0] = "Server";
})(LOWBOX_TYPE || (LOWBOX_TYPE = {}));
var TEXT_TYPE;
(function (TEXT_TYPE) {
    TEXT_TYPE[TEXT_TYPE["Flat"] = 0] = "Flat";
    TEXT_TYPE[TEXT_TYPE["Floating"] = 1] = "Floating";
})(TEXT_TYPE || (TEXT_TYPE = {}));
var IMAGE_TYPE;
(function (IMAGE_TYPE) {
    IMAGE_TYPE[IMAGE_TYPE["Flat"] = 0] = "Flat";
    IMAGE_TYPE[IMAGE_TYPE["Floating"] = 1] = "Floating";
})(IMAGE_TYPE || (IMAGE_TYPE = {}));
var CYLINDER_TYPE;
(function (CYLINDER_TYPE) {
    CYLINDER_TYPE[CYLINDER_TYPE["AzureCache"] = 0] = "AzureCache";
    CYLINDER_TYPE[CYLINDER_TYPE["AzureSQL"] = 1] = "AzureSQL";
    CYLINDER_TYPE[CYLINDER_TYPE["DocumentDB"] = 2] = "DocumentDB";
    CYLINDER_TYPE[CYLINDER_TYPE["MySQL"] = 3] = "MySQL";
    CYLINDER_TYPE[CYLINDER_TYPE["SQLDataSync"] = 4] = "SQLDataSync";
    CYLINDER_TYPE[CYLINDER_TYPE["SQLDatabase"] = 5] = "SQLDatabase";
    CYLINDER_TYPE[CYLINDER_TYPE["BlobStorage"] = 6] = "BlobStorage";
})(CYLINDER_TYPE || (CYLINDER_TYPE = {}));
var AzureLens = (function () {
    function AzureLens() {
        var _this = this;
        this._objects = {};
        this.selectedItem = null;
        this.menu = null;
        this._objects = {};
        this.visualizer = new app3DView();
        this.visualizer.displayPopup = this.displayPopup;
        document.getElementById("popupExpand").addEventListener("click", function (evt) {
            _this.popupExpand(evt);
        });
        document.getElementById("expandedClose").addEventListener("click", function (evt) {
            _this.expandedClose(evt);
        });
        window.addEventListener('click', function (evt) {
            _this.visualizer.click(evt);
        });
        window.addEventListener('keyup', function (evt) {
            _this.visualizer.keyUp(evt);
        }, false);
        window.addEventListener('keydown', function (evt) {
            _this.visualizer.keyDown(evt);
        }, false);
        window.addEventListener('mousedown', function (evt) {
            _this.visualizer.mouseDown(evt);
        }, false);
        window.addEventListener('pointerdown', function (evt) {
            _this.visualizer.pointerDown(evt);
        }, false);
        window.addEventListener("resize", function () {
            if (_this._canvas != null) {
                _this._canvas.width = window.innerWidth;
                _this._canvas.height = window.innerHeight;
            }
            _this.visualizer.resize(null);
            if (_this.menu != null) {
                _this.menu.multilevelpushmenu('redraw');
            }
        });
        this.menu = $('#menu');
        this.menu.visible = false;
        this.menu.multilevelpushmenu({
            direction: 'ltr',
            backItemIcon: 'fa fa-angle-left',
            groupIcon: 'fa fa-angle-right',
            collapsed: false,
            menuHeight: '100%',
            onExpandMenuStart: function () {
                _this.expandedClose(null);
            },
            onItemClick: function () {
                _this.expandedClose(null);
                _this.closePopup();
                var element = arguments[2][0];
                var anchor = element.firstElementChild;
                if (anchor.href.indexOf('#nav') > 0) {
                    //Navigation menus
                    var id = anchor.href.substr(anchor.href.indexOf('#nav') + 4, anchor.href.length - anchor.href.indexOf('#nav') - 4);
                    //this.manualMode = false;
                    var value = id;
                    _this._definition.objects.forEach(function (item) {
                        if (value == item.id) {
                            _this.visualizer.navigateToMesh(item);
                        }
                    });
                    window.event.cancelBubble = true;
                }
                else if (anchor.href.indexOf('diag') > 0) {
                    //Diagram menus
                    var id = anchor.href.substr(anchor.href.indexOf('#diag') + 5, anchor.href.length - anchor.href.indexOf('#diag') - 5);
                    _this.destroyScene();
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.open("GET", "SampleModels/" + id, true);
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                            _this.createScene(xmlhttp.responseText);
                        }
                    };
                    xmlhttp.send();
                }
                else if (anchor.href.indexOf('#ni') > 0) {
                    _this.notImplemented();
                }
            }
        });
    }
    AzureLens.prototype.displayPopup = function (item) {
        var popupDiv = document.getElementById("popupDiv");
        var popupName = document.getElementById("popupName");
        var popupDescription = document.getElementById("popupDescription");
        if (item.description != null) {
            popupDiv.style.display = "block";
            popupName.innerText = "Name: " + item.id;
            popupDescription.innerText = item.description;
        }
        else
            popupDiv.style.display = "none";
    };
    AzureLens.prototype.notImplemented = function () {
        window.alert("This feature hasn't been implemented yet. Help us build it!");
    };
    AzureLens.prototype.closePopup = function () {
        var popupDiv = document.getElementById("popupDiv");
        popupDiv.style.display = "none";
    };
    AzureLens.prototype.popupExpand = function (evt) {
        this.closePopup();
        var expandedPopupDiv = document.getElementById("expandedPopupDiv");
        expandedPopupDiv.style.display = "block";
        this.menu.multilevelpushmenu('collapse');
    };
    AzureLens.prototype.expandedClose = function (evt) {
        this.closePopup();
        var expandedPopupDiv = document.getElementById("expandedPopupDiv");
        expandedPopupDiv.style.display = "none";
    };
    AzureLens.prototype.destroyScene = function () {
        if (this._canvas != null) {
            this.visualizer.destroyScene();
            this._definition = null;
            this._canvas = null;
            this._objects = {};
            this.selectedItem = null;
        }
    };
    AzureLens.prototype.createScene = function (sceneData) {
        this._canvas = document.getElementById("renderCanvas");
        var data = JSON.parse(sceneData);
        this._definition = data;
        this.visualizer.createScene(this._definition, this._canvas);
        //Diagrams menu
        var diagramMenu = this.menu.multilevelpushmenu('finditemsbyname', 'Diagrams').first();
        this.menu.multilevelpushmenu('removeitems', diagramMenu);
        var $addTo = this.menu.multilevelpushmenu('findmenusbytitle', 'Browse').first();
        var addItems = [{
            name: 'Diagrams',
            icon: '',
            link: '#',
            items: [
                {
                    title: 'Diagrams',
                    icon: '',
                    link: '#',
                    items: [
                    ]
                }
            ]
        }];
        addItems[0].items[0].items.unshift({
            name: "Upload your own diagram",
            icon: '',
            link: '#ni'
        });
        addItems[0].items[0].items.unshift({
            name: "How-old.Net architecture",
            icon: '',
            link: '#diagFaceDemo.json'
        });
        addItems[0].items[0].items.unshift({
            name: "AzureLens architecture",
            icon: '',
            link: '#diagAzureLens.json'
        });
        this.menu.multilevelpushmenu('additems', addItems, $addTo, 0);
        //Navigate menu
        var navigateMenu = this.menu.multilevelpushmenu('finditemsbyname', 'Navigate').first();
        this.menu.multilevelpushmenu('removeitems', navigateMenu);
        $addTo = this.menu.multilevelpushmenu('findmenusbytitle', 'AzureLens').first();
        var addItems2 = [{
            name: 'Navigate',
            icon: 'fa fa-eye',
            link: '#',
            items: [
                {
                    title: 'Navigate',
                    icon: 'fa fa-eye',
                    link: '#',
                    items: [
                    ]
                }
            ]
        }];
        data.objects.forEach(function (item) {
            if (item.pinnedToMenu == true) {
                addItems2[0].items[0].items.unshift({
                    name: item.menuName,
                    icon: '',
                    link: '#nav' + item.id
                });
            }
        });
        addItems2[0].items[0].items = addItems2[0].items[0].items.sort(function (a, b) {
            return a.name > b.name ? 1 : -1;
        });
        this.menu.multilevelpushmenu('additems', addItems2, $addTo, 3);
        this.menu.visible = true;
        this.menu.multilevelpushmenu('expand', this.menu.multilevelpushmenu('findmenusbytitle', 'Navigate').first());
        this.visualizer.resize(null);
        this.menu.multilevelpushmenu('redraw');
    };
    return AzureLens;
})();
//*********************************************************   
//   
//AzureLens.Net, https://github.com/matvelloso/azurelens 
//  
//Copyright (c) Microsoft Corporation  
//All rights reserved.   
//  
// MIT License:  
// Permission is hereby granted, free of charge, to any person obtaining  
// a copy of this software and associated documentation files (the  
// ""Software""), to deal in the Software without restriction, including  
// without limitation the rights to use, copy, modify, merge, publish,  
// distribute, sublicense, and/or sell copies of the Software, and to  
// permit persons to whom the Software is furnished to do so, subject to  
// the following conditions:  
// The above copyright notice and this permission notice shall be  
// included in all copies or substantial portions of the Software.  
// THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,  
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF  
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND  
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE  
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION  
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION  
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.  
//   
//*********************************************************   
//# sourceMappingURL=app.js.map