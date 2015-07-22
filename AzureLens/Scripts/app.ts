// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.
///<reference path="IAppView.ts" />
///<reference path="app3DView.ts" />
class BoxData {
    public Image: string;
}

class CylinderData {
    public Image: string;
}

class ObjectData {
    public ID: string;
    public Type: string;
    public Meshes: BABYLON.Mesh[];
}
enum ARROW_TYPE {
    Simple,
    ArrowTip,
    ArrowTipBothEnds
}
enum BOX2D_TYPE {
    BorderOnly,
    Filled
}

enum BOX_TYPE {
    VM,
    WebSite,
    O365,
    GitRepo,
    GitHub,
    VSO,
    MachineLearning,
    HDInsight,
    StreamAnalytics,
    EventHubs
}

enum LOWBOX_TYPE {
    Server
}
enum TEXT_TYPE {
    Flat,
    Floating
}

enum IMAGE_TYPE {
    Flat,
    Floating
}

enum CYLINDER_TYPE {
    AzureCache,
    AzureSQL,
    DocumentDB,
    MySQL,
    SQLDataSync,
    SQLDatabase,
    BlobStorage
}


class AzureLens {
    private _definition;
    private _objects = {};
    private selectedItem = null;
    private menu = null;
    private visualizer: IAppView;
    private _canvas: HTMLCanvasElement;

   

    constructor() {
        this._objects = {};
        this.visualizer = new app3DView();
        this.visualizer.displayPopup = this.displayPopup;

        document.getElementById("popupExpand").addEventListener("click",(evt) => { this.popupExpand(evt); });
        document.getElementById("expandedClose").addEventListener("click",(evt) => { this.expandedClose(evt); });

        window.addEventListener('click',(evt) => {
            this.visualizer.click(evt);
        });

        window.addEventListener('keyup',(evt) => {
            this.visualizer.keyUp(evt);
        }, false);

        window.addEventListener('keydown',(evt) => {
            this.visualizer.keyDown(evt);
        }, false);

        window.addEventListener('mousedown',(evt) => {
            this.visualizer.mouseDown(evt);
        }, false);

        window.addEventListener('pointerdown',(evt) => {
            this.visualizer.pointerDown(evt);
        }, false);

        window.addEventListener("resize",() => {
            if (this._canvas != null) {
                this._canvas.width = window.innerWidth;
                this._canvas.height = window.innerHeight;
            }
            this.visualizer.resize(null);
            
            if (this.menu != null) {
                this.menu.multilevelpushmenu('redraw');
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
            onExpandMenuStart:  ()=> {
                this.expandedClose(null);
            },
            onItemClick: (a:any,b:any,args:any[]) => {

                this.expandedClose(null);
                this.closePopup();
                var element: HTMLElement = args[0];
                var anchor: HTMLAnchorElement = <HTMLAnchorElement>element.firstElementChild;

                if (anchor.href.indexOf('#nav') > 0) {
                    //Navigation menus

                    var id = anchor.href.substr(anchor.href.indexOf('#nav') + 4,
                        anchor.href.length - anchor.href.indexOf('#nav') - 4);
                    //this.manualMode = false;
                    var value = id;
                    this._definition.objects.forEach((item) => {
                        if (value == item.id) {
                          
                            this.visualizer.navigateToMesh(item);
                        }
                    });
                    window.event.cancelBubble = true;
                } else if (anchor.href.indexOf('diag') > 0) {
                    //Diagram menus
                    var id = anchor.href.substr(anchor.href.indexOf('#diag') + 5,
                        anchor.href.length - anchor.href.indexOf('#diag') - 5);
                    this.destroyScene();
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.open("GET", "SampleModels/" + id, true);
                    xmlhttp.onreadystatechange = () => {
                        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                            this.createScene(xmlhttp.responseText);
                        }
                    }
                    xmlhttp.send();
                } else if (anchor.href.indexOf('#ni') > 0) {
                    this.notImplemented();
                }
            }
        });
    }


    public displayPopup(item) {
        var popupDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("popupDiv");
        var popupName: HTMLDivElement = <HTMLDivElement>document.getElementById("popupName");
        var popupDescription: HTMLDivElement = <HTMLDivElement>document.getElementById("popupDescription");

        if (item.description != null) {
            popupDiv.style.display = "block";
            popupName.innerText = "Name: " + item.id;
            popupDescription.innerText = item.description;
        } else
            popupDiv.style.display = "none";
    }

    public notImplemented() {
        window.alert("This feature hasn't been implemented yet. Help us build it!");
    }

    public closePopup() {
        var popupDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("popupDiv");
        popupDiv.style.display = "none";

    }

    public popupExpand(evt) {
        this.closePopup();
        var expandedPopupDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("expandedPopupDiv");
        expandedPopupDiv.style.display = "block";
        this.menu.multilevelpushmenu('collapse');
    }

    public expandedClose(evt) {
        this.closePopup();
        var expandedPopupDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("expandedPopupDiv");
        expandedPopupDiv.style.display = "none";
    }

    public destroyScene() {
        if (this._canvas != null) {
            this.visualizer.destroyScene();
            this._definition = null;
            this._canvas = null;
            this._objects = {};
            this.selectedItem = null;
        }
    }

    public createScene(sceneData: string) {
        this._canvas = <HTMLCanvasElement>document.getElementById("renderCanvas");
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
                }]
        }];

        addItems[0].items[0].items.unshift(
            {
                name: "Upload your own diagram",
                icon: '',
                link: '#ni'
            });

        addItems[0].items[0].items.unshift(
            {
                name: "How-old.Net architecture",
                icon: '',
                link: '#diagFaceDemo.json'
            });

        addItems[0].items[0].items.unshift(
            {
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
                }]
        }];

        data.objects.forEach((item) => {
            if (item.pinnedToMenu == true) {
                addItems2[0].items[0].items.unshift(
                    {
                        name: item.menuName,
                        icon: '',
                        link: '#nav' + item.id
                    });
            }
        });
        addItems2[0].items[0].items = addItems2[0].items[0].items.sort(function (a, b) {
            return a.name > b.name ? 1 : -1
        });

        this.menu.multilevelpushmenu('additems', addItems2, $addTo, 3);
        this.menu.visible = true;
        this.menu.multilevelpushmenu('expand', this.menu.multilevelpushmenu('findmenusbytitle', 'Navigate').first());

        this.visualizer.resize(null);

        this.menu.multilevelpushmenu('redraw');


    }
}
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
