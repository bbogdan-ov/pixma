import { ActionAttachable, CommandAction } from "@base/managers";
import { AppContained } from "@base/types/types";
import type { App } from "@source/App";

export type ActionAppContainedAttachable = AppContained<App> & ActionAttachable;

// App contained action
export class AppContainedAction<A extends ActionAppContainedAttachable=ActionAppContainedAttachable> extends CommandAction<A> {
	get app(): App {
		return this.attachable.app;
	}
}
