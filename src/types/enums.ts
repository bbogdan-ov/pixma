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
