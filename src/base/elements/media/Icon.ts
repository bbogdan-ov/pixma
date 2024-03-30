import { IconName } from "@base/types/enums";
import { BaseElement } from "..";
import { DOM } from "@base/utils";

export const icons = {
    [IconName.SMALL_CROSS]: `<svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L4 4M7 7L4 4M4 4L7 1M4 4L1 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    [IconName.CROSS]: `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L6 6M11 11L6 6M6 6L11 1M6 6L1 11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    [IconName.SMALL_ARROW_UP]: `<svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 5.85785L5 1.85785L9 5.85785" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    [IconName.SMALL_ARROW_DOWN]: `<svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1.85785L5 5.85785L9 1.85785" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    [IconName.EDIT_LAYER]: `<svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 10.8578V8.35294C7 7.82251 7.21071 7.3138 7.58579 6.93873L12.2525 2.27206C13.0335 1.49101 14.2998 1.49101 15.0809 2.27206L15.5858 2.77697C16.3668 3.55802 16.3668 4.82435 15.5858 5.6054L10.9191 10.2721C10.544 10.6471 10.0353 10.8578 9.50491 10.8578H7Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <path d="M10 14.8578H3C1.89543 14.8578 1 13.9624 1 12.8578V8.85785C1 7.75328 1.89543 6.85785 3 6.85785H4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    [IconName.ADD_LAYER]: `<svg width="17" height="13" viewBox="0 0 17 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 6.85785H11M11 6.85785H16M11 6.85785V1.85785M11 6.85785V11.8578" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M6 2.85785H3C1.89543 2.85785 1 3.75328 1 4.85785V8.85785C1 9.96242 1.89543 10.8578 3 10.8578H6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    [IconName.REMOVE_LAYER]: `<svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 1.85785L11 5.85785M15 9.85785L11 5.85785M11 5.85785L15 1.85785M11 5.85785L7 9.85785" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M6 5.85785H3C1.89543 5.85785 1 6.75328 1 7.85785V11.8578C1 12.9624 1.89543 13.8578 3 13.8578H9C10.1046 13.8578 11 12.9624 11 11.8578V10.8578" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    [IconName.DUPLICATE_LAYER]: `<svg width="15" height="13" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 12H3C1.89543 12 1 11.1046 1 10V6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <rect x="4" y="1" width="10" height="8" rx="2" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    [IconName.ADD_COLOR]: `<svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 6H12M12 6H17M12 6V1M12 6V11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M7 1H6C3.23858 1 1 3.23858 1 6V6C1 8.76142 3.23858 11 6 11H7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    [IconName.REMOVE_COLOR]: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 1L11 5M15 9L11 5M11 5L15 1M11 5L7 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M6.2381 5H6C3.23858 5 1 7.23858 1 10V10C1 12.7614 3.23858 15 6 15V15C8.76142 15 11 12.7614 11 10V9.7619" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    [IconName.EDIT_COLOR]: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 11V8.49509C7 7.96466 7.21071 7.45595 7.58579 7.08088L12.2525 2.41421C13.0335 1.63316 14.2998 1.63317 15.0809 2.41421L15.5858 2.91912C16.3668 3.70017 16.3668 4.9665 15.5858 5.74755L10.9191 10.4142C10.544 10.7893 10.0353 11 9.50491 11H7Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <path d="M10.5 14.1821C9.68964 15.8501 7.9791 17 6 17C3.23858 17 1 14.7614 1 12C1 10.0209 2.14985 8.31036 3.81794 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    [IconName.DUPLICATE_COLOR]: `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.53553 14.5355C9.07124 14.9998 8.52004 15.3681 7.91342 15.6194C7.30679 15.8707 6.65661 16 6 16C5.34339 16 4.69321 15.8707 4.08658 15.6194C3.47995 15.3681 2.92876 14.9998 2.46447 14.5355C2.00017 14.0712 1.63188 13.52 1.3806 12.9134C1.12933 12.3068 1 11.6566 1 11C1 10.3434 1.12933 9.69321 1.3806 9.08658C1.63188 8.47995 2.00017 7.92876 2.46447 7.46447" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <circle cx="11" cy="6" r="5" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    [IconName.CHECKMARK]: `<svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 8.2L5.57143 13L17 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    [IconName.SMALL_CHECKMARK]: `<svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 5.8L3.85714 9L11 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    [IconName.GRID_VIEW]: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" stroke-width="2"/>
        <rect x="1" y="10" width="5" height="5" rx="1" stroke="currentColor" stroke-width="2"/>
        <rect x="10" y="1" width="5" height="5" rx="1" stroke="currentColor" stroke-width="2"/>
        <rect x="10" y="10" width="5" height="5" rx="1" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    [IconName.LIST_VIEW]: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="14" height="5" rx="1" stroke="currentColor" stroke-width="2"/>
        <rect x="1" y="10" width="14" height="5" rx="1" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    [IconName.SHORT_LIST_VIEW]: `<svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="14" height="5" rx="1" stroke="currentColor" stroke-width="2"/>
        <path d="M15 9V10C15 10.5523 14.5523 11 14 11H2C1.44772 11 1 10.5523 1 10V9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    [IconName.VISIBLE]: `<svg width="14" height="7" viewBox="0 0 14 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 5C2.19765 2.6088 4.43616 1 7 1C9.56384 1 11.8023 2.6088 13 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="7" cy="4" r="3" fill="currentColor"/>
    </svg>`,
    [IconName.HIDDEN]: `<svg width="14" height="6" viewBox="0 0 14 6" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1C2.19765 3.39121 4.43616 5 7 5C9.56384 5 11.8023 3.39121 13 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    [IconName.LOCKED]: `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1.85785" y="6" width="10" height="6" rx="2" stroke="currentColor" stroke-width="2"/>
        <path d="M9.85785 5.99999V4C9.85785 2.34315 8.5147 1 6.85785 1V1C5.20099 1 3.85785 2.34315 3.85785 4V6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    [IconName.UNLOCKED]: `<svg width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1.85785" y="8" width="10" height="6" rx="2" stroke="currentColor" stroke-width="2"/>
        <path d="M9.85785 4.5V4C9.85785 2.34315 8.5147 1 6.85785 1V1C5.20099 1 3.85785 2.34314 3.85785 4V7.99999" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    [IconName.CLOSE_WINDOW]: `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L5 5M9 9L5 5M5 5L9 1M5 5L1 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    [IconName.MAXIMIZED_WINDOW]: `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="8" height="8" rx="2" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    [IconName.UNMAXIMIZED_WINDOW]: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.8 9H11C12.1046 9 13 8.10457 13 7V3C13 1.89543 12.1046 1 11 1H7C5.89543 1 5 1.89543 5 3V4.2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <rect x="1" y="5" width="8" height="8" rx="2" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    [IconName.MINIMIZED_WINDOW]: `<svg width="10" height="2" viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1H9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    
    [IconName.PEN_TOOL]: `<svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.85786 4L10.4437 2.41421C11.2247 1.63316 12.491 1.63316 13.2721 2.41421L15.4437 4.58579C16.2247 5.36683 16.2247 6.63317 15.4437 7.41421L13.8579 9M8.85786 4L2.44365 10.4142C2.06858 10.7893 1.85786 11.298 1.85786 11.8284V16H6.02944C6.55987 16 7.06858 15.7893 7.44365 15.4142L13.8579 9M8.85786 4L13.8579 9" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    </svg>`,
    [IconName.ERASE_TOOL]: `<svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.85786 7L2.58293 11.2749C1.69049 12.1674 1.83762 13.6532 2.88774 14.3533L3.85786 15H8.85786L11.8579 12M6.85786 7L11.4437 2.41421C12.2247 1.63317 13.491 1.63317 14.2721 2.41421L16.4437 4.58579C17.2247 5.36684 17.2247 6.63317 16.4437 7.41421L11.8579 12M6.85786 7L11.8579 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    </svg>`,
    [IconName.LINE_TOOL]: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 12L11.5 4.5" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <circle cx="13" cy="3" r="2" stroke="currentColor" stroke-width="2"/>
        <circle cx="3" cy="13" r="2" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    [IconName.RECT_TOOL]: `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.1667 3H5M14 4.83333V12M4.83333 14H12M3 12.1667V5" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <circle cx="14" cy="3" r="2" stroke="currentColor" stroke-width="2"/>
        <circle cx="14" cy="14" r="2" stroke="currentColor" stroke-width="2"/>
        <circle cx="3" cy="3" r="2" stroke="currentColor" stroke-width="2"/>
        <circle cx="3" cy="14" r="2" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    [IconName.ELLIPSE_TOOL]: `<svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="13" cy="7" r="2" stroke="currentColor" stroke-width="2"/>
        <path d="M13 5.27557C12.2433 2.80236 9.90085 1 7.12844 1C3.7438 1 1 3.68629 1 7C1 10.3137 3.7438 13 7.12844 13C9.90085 13 12.2433 11.1976 13 8.72443" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    [IconName.FILL_TOOL]: `<svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.67721 12.377C0.893047 11.5991 0.893048 10.3379 1.67721 9.55993L8.24312 3.04635L13.0664 7.83115C13.8505 8.60907 13.8505 9.87033 13.0664 10.6482L7.92031 15.7533C7.13615 16.5312 5.86476 16.5312 5.08059 15.7533L1.67721 12.377Z" stroke="currentColor" stroke-width="2"/>
        <path d="M10.8216 5.60431L6.18033 1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M15.6962 14.5839L14.9296 13.822C14.5396 13.4343 13.9098 13.4343 13.5197 13.822L12.745 14.592L12.7459 14.5936C12.4025 14.9554 12.192 15.4432 12.192 15.9798C12.192 17.0955 13.102 18 14.2247 18C15.3473 18 16.2574 17.0955 16.2574 15.9798C16.2574 15.439 16.0436 14.9479 15.6954 14.5853L15.6962 14.5839Z" fill="currentColor"/>
    </svg>`,
    [IconName.DITHERING_TOOL]: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect y="4" width="4" height="4" rx="1" fill="currentColor"/>
        <rect y="12" width="4" height="4" rx="1" fill="currentColor"/>
        <rect x="4" width="4" height="4" rx="1" fill="currentColor"/>
        <rect x="4" width="4" height="4" rx="1" fill="currentColor"/>
        <rect x="4" y="8" width="4" height="4" rx="1" fill="currentColor"/>
        <rect x="8" y="4" width="4" height="4" rx="1" fill="currentColor"/>
        <rect x="8" y="12" width="4" height="4" rx="1" fill="currentColor"/>
        <rect x="12" width="4" height="4" rx="1" fill="currentColor"/>
        <rect x="12" width="4" height="4" rx="1" fill="currentColor"/>
        <rect x="12" y="8" width="4" height="4" rx="1" fill="currentColor"/>
    </svg>`,
    [IconName.RECT_SELECTION_TOOL]: `<svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1.85785" y="1" width="15" height="15" rx="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 4"/>
    </svg>`,
    [IconName.BRUSH_SELECTION_TOOL]: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5987 12.5987C15.1311 11.9374 17 9.63435 17 6.89474C17 3.63916 14.3608 1 11.1053 1C8.1862 1 5.75901 2.57674 4.33676 3.9101C2.85987 5.29469 1 7.79412 1 11.1053C1 14.3608 3.63916 17 6.89474 17C9.63435 17 11.9374 15.1311 12.5987 12.5987Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 4"/>
    </svg>`,
    [IconName.PIPETTE_TOOL]: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 7L1.58579 13.4142C1.21071 13.7893 1 14.298 1 14.8284V17H3.17157C3.70201 17 4.21071 16.7893 4.58579 16.4142L11 10M8 7L11 10M8 7L7 6L8 5L10 4L11.5858 2.41421C12.3668 1.63316 13.6332 1.63316 14.4142 2.41421L15.5858 3.58579C16.3668 4.36683 16.3668 5.63317 15.5858 6.41421L14 8L13 10L12 11L11 10" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    </svg>`,

    [IconName.FOLD]: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5858 10.5858L3.41421 1.41421C2.15428 0.154284 0 1.04662 0 2.82843V12C0 13.1046 0.895431 14 2 14H11.1716C12.9534 14 13.8457 11.8457 12.5858 10.5858Z" fill="currentColor"/>
    </svg>`
}

@BaseElement.define("base-icon")
export class Icon extends BaseElement {
    constructor(type: IconName | null) {
        super();

        this.classList.add("icon");
        this.setType(type);
    }

    setType(type: IconName | null) {
        this.replaceChildren();
        if (type === null) {
            this.classList.add("empty");
            return;
        }

        this.classList.remove("empty");
        this.classList.add("icon-" + type);

        this.append(...DOM.html(icons[type]));
    }
}
