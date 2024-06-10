import { Injectable } from "@angular/core";
import { Moment } from "moment";
import * as moment from "moment";
import { Lookup } from "src/app/common.types";

@Injectable({
    providedIn: "root",
})
export class UtilityService {
    toSnakeCase(text: string): string {
        return text.replace(/[A-Z]/g, (letter) => '_' + letter.toLowerCase());
    }

    removeEmptyValues<T>(obj: { [x: string]: string; }): T {
        const filteredObj = Object.keys(obj).filter(key => obj[key]);
        const resultObj: { [x: string]: string; } = {};
        
        filteredObj.forEach(key => {
            resultObj[key] = obj[key];
        });
      
        return resultObj as unknown as T;
    }

    toUTC(date: Moment): Moment {
        const timezoneOffsetMs = date.utcOffset() * 60000;

        return moment(date.valueOf() + timezoneOffsetMs);
    }

    getLastDayOfMonth(date: Moment): Moment {
		return date
			.endOf('month')
			.startOf('day');
	}

    findSelectedObject(items: Lookup[], toMatchWith: string): string {
        return items.find(item => item.displayName === toMatchWith)?.value ?? '';
    }
}
