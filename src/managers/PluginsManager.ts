import { Tab } from "@base/common/tabs";
import { TabElement, TabView } from "@base/elements/tabs";
import { Manager } from "@base/managers";
import { DOM, Dev } from "@base/utils";
import { DrawingLayer } from "@source/common/layers";
import { Project } from "@source/common/project";
import { Button } from "@base/elements/buttons";
import { Tool } from "@source/common/tools";
import type App from "@source/App";

export default class PluginsManager extends Manager {
    readonly app: App;
    
    constructor(app: App) {
        super();

        this.app = app;

        this.load("plugins/test.js");
    }

    load(path: string) {
        const pixma = {
            app: this.app,
            Project,
            Tab,
            TabElement,
            TabView,
            DrawingLayer,
            Button,
            Tool,
            Dev,
            DOM,
        }
        
        fetch(path, {
            method: "GET",
            headers: { "Content-Type": "plain/text" }
        })
            .then(res=> res)
            .then(data=> data.text())
            .then(text=> {
                try {
                    const plugin = new Function("pixma", text)(pixma);
                    console.log(`Plugin "${ plugin.title }" loaded!`)
                    if (plugin.load)
                        plugin.load()
                } catch(err) {
                    console.error(`Plugin error! Error: ${ err }`)
                }
            })
            .catch(err=> console.error(err));
    }
}
