// user initial info
export interface UserSettingDto {
    readonly nickname: string,
    readonly dtype: ISetCategory,
    readonly time: ISetTime,
};

export interface ISetTime {
    // [ time: string ]: boolean
    morning: boolean,
    afternoon: boolean,
    night: boolean,
};

export interface ISetUserCategory {
    userId?: number,
    categoryId?: number,
    nextItemId?: number,
};

export type ResetTimeDto = ISetTime[];
export type ResetCategoryDto = ISetCategory[];


export interface ISetCategory {
    joke: boolean,
    compliment: boolean,
    condolence: boolean,
    scolding: boolean
};


export interface ISetTodayWal {
    userId: number;
    categoryId?: number,
    itemId?: number;
    reservationId?: number;
    time: Date;
    userDefined?: boolean
};