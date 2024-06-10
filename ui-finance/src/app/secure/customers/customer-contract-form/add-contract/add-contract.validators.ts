import { FormArray, FormGroup } from "@angular/forms";

export function validateBillingPlan(name: string): (group: FormGroup) => void {
    return (group: FormGroup) => {
        const len = group.get('plans')?.value.length;
        const formArray = group.get('plans') as FormArray;

        if (len == 1) {
            formArray.at(0).get(name)?.setErrors(null);
            return;
        }

        for (let i=0;i<len;i++) {
            const planGroup = formArray.at(i) as FormGroup;

            if (!planGroup.get(name)?.value) {
                planGroup.get(name)?.setErrors({billingPlanMissingError: true});
            }
        }
    };
}
