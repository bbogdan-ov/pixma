export enum CompositeOperation {
    SOURCE_OVER = "source-over",
    SOURCE_IN = "source-in",
    SOURCE_OUT = "source-out",
    SOURCE_ATOP = "source-atop",
    DESTINATION_OVER = "destination-over",
    DESTINATION_IN = "destination-in",
    DESTINATION_OUT = "destination-out",
    DESTINATION_ATOP = "destination-atop",
    LIGHTER = "lighter",
    COPY = "copy",
    XOR = "xor",
    MULTIPLY = "multiply",
    SCREEN = "screen",
    OVERLAY = "overlay",
    DARKEN = "darken",
    LIGHTEN = "lighten",
    COLOR_DODGE = "color-dodge",
    COLOR_BURN = "color-burn",
    HARD_LIGHT = "hard-light",
    SOFT_LIGHT = "soft-light",
    DIFFERENCE = "difference",
    EXCLUSION = "exclusion",
    HUE = "hue",
    SATURATION = "saturation",
    COLOR = "color",
    LUMINOSITY = "luminosity",

    /** Alias to `SOURCE_OVER` */
    DEFAULT = SOURCE_OVER,
    /** Alias to `DESTINATION_OUT` */
    ERASE = DESTINATION_OUT,
    /** Alias to `DESTINATION_IN` */
    MASK = DESTINATION_IN
}

export enum AppCommand {
	// App
	HELLO 				= "hello",
	ENTER_FIRST_TAB   	= "enter-first-tab",
	ENTER_SECOND_TAB  	= "enter-second-tab",
	ENTER_THIRD_TAB   	= "enter-third-tab",
	ENTER_FOURTH_TAB  	= "enter-fourth-tab",
	ENTER_FIFTH_TAB   	= "enter-fifth-tab",
	ENTER_SIXTH_TAB   	= "enter-sixth-tab",
	ENTER_SEVENTH_TAB 	= "enter-seventh-tab",
	ENTER_EIGHTH_TAB  	= "enter-eighth-tab",
	ENTER_NINETH_TAB  	= "enter-nineth-tab",
	ENTER_TENTH_TAB   	= "enter-tenth-tab",
	UNDO 				= "undo",
	REDO 				= "redo",
	
	// Editor
	SWAP_COLORS 			= "swap-colors",
	ADD_DRAWING_LAYER_BELOW = "add-drawing-layer-below",
	ADD_DRAWING_LAYER_ABOVE = "add-drawing-layer-above",
	REMOVE_CURRENT_LAYER 	= "remove-current-layer", 

	// Windows
	CLOSE_WINDOW 			= "close-window",

	// Local
	RENAME_CURRENT_LAYER	= "rename-current-layer",
}
export enum AppOption {
	HELLO = "hello",
	HELLO_MESSAGE = "hello-message",
	DEFAULT_CANVAS_WIDTH = "default-canvas-width",
	DEFAULT_CANVAS_HEIGHT = "default-canvas-height",
}
export enum AppCategory {
	GENERAL = "general",
}
