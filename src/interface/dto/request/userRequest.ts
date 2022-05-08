// user initial info
export interface UserSettingDto {
    readonly nickname?: string,
    readonly dtype?: ISetCategory,
    readonly time?: ISetTime,
};

export interface ISetTime {
    // [ time: string ]: boolean
    morning?: boolean,
    afternoon?: boolean,
    night?: boolean,
};

export interface ISetUserCategory {
    user_id?: number,
    category_id?: number,
    next_item_id?: number,
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
    user_id: number;
    category_id: number;
    item_id: number;
    time: Date;
};