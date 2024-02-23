import { FocusableElement } from "@base/elements";
import { AccentName, ColorName, EventName, IconName, SizeName } from "@base/types/enums";
import { DOM } from "@base/utils";
import { Icon } from "@base/elements/media";
import { IThemeColorful, IThemeResizeable } from "@base/types/types";

@FocusableElement.define("base-button")
export default class Button extends FocusableElement implements IThemeColorful, IThemeResizeable {
    readonly inner = DOM.div("button-inner");
    readonly content = DOM.div("button-content");
    protected _icon: Icon | null = null;
    protected _color: ColorName | AccentName = AccentName.SECONDARY;
    protected _size: SizeName = SizeName.NORMAL;

    constructor() {
        super();

        this.classList.add("button");
        this.content.style.display = "none";

        this.setColor(this._color);
        this.setSize(this._size);

        this.inner.append(this.content);
        this.append(this.inner);
    }

    enable() {
        this.classList.remove("disabled");
    }
    disable() {
        this.classList.add("disabled");
    }

    // On
    onMount(): void {
        super.onMount();

        this.listen(this, EventName.CLICK, this._onClick.bind(this));
        this.listen(this, EventName.DOWN, this._onDown.bind(this));
        this.listen(this, EventName.UP, this._onUp.bind(this));
    }
    protected _onInteract(event: KeyboardEvent): void {
        super._onInteract(event);

        this.click();
    }
    protected _onClick(event: MouseEvent) {}
    protected _onDown(event: MouseEvent) {}
    protected _onUp(event: MouseEvent) {}

    // Set
    setContent(htmlString: string | null): this {
        if (!htmlString) {
            this.content.style.display = "none";
            return this;
        }

        this.content.style.display = "";
        this.content.innerHTML = htmlString;
        return this;
    }
    setIcon(icon: IconName | null): this {
        if (!icon) {
            if (this._icon)
                this._icon.remove();
            this._icon = null;
            return this;
        }

        if (this._icon) {
            this._icon.setType(icon);
        } else {
            this._icon = new Icon(icon);
            this.inner.prepend(this._icon);
        }

        return this;
    }
    setIsCompact(value: boolean=true): this {
        if (value)
            this.classList.add("compact");
        else
            this.classList.remove("compact")
        return this;
    }
    setIsGhost(value: boolean=true): this {
        if (value)
            this.classList.add("ghost");
        else
            this.classList.remove("ghost")
        return this;
    }
    setIsActive(value: boolean=true): this {
        if (value)
            this.classList.add("active")
        else
            this.classList.remove("active")
        return this;
    }
    setIsEnabled(value: boolean=true): this {
        if (value)
            this.enable();
        else
            this.disable();
        return this;
    }
    setColor(name: ColorName | AccentName): this {
        this.replaceClassName(`color-${ this.color }`, `color-${ name }`);
        this._color = name;
        return this;
    }
    setSize(name: SizeName): this {
        this.replaceClassName(`size-${ this.size }`, `size-${ name }`);
        this._size = name;
        return this;
    }

    // Get
    get color(): ColorName | AccentName {
        return this._color;
    }
    get size(): SizeName {
        return this._size;
    }

    // Static
    static icon(icon: IconName): Button {
        return new Button().setIcon(icon);
    }
    static compact(icon: IconName | null): Button {
        return new Button().setIsCompact().setIcon(icon);
    }
    static ghost(): Button {
        return new Button().setIsGhost();
    }

    static action(icon: IconName | null): Button {
        return Button.ghost()
            .setIsCompact()
            .setSize(SizeName.TINY)
            .setIcon(icon);
    }
}
