import { Directive, Input } from '@angular/core';

import { NG_VALIDATORS, Validator, AbstractControl, ValidatorFn, ValidationErrors, FormGroup } from '@angular/forms';

export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
        const forbidden = nameRe.test(control.value);
        return forbidden ? {'forbiddenName': {value: control.value}} : null;
    };
};
@Directive({
    selector: '[appForbiddenName]',
    providers: [
        {
            provide: NG_VALIDATORS, 
            useExisting: ForbiddenValidatorDirective, 
            multi: true
        }
    ]
})
export class ForbiddenValidatorDirective implements Validator {
    @Input('appForbiddenName') forbiddenName: string;
 
    validate(control: AbstractControl): {[key: string]: any} | null {
        console.log('yes in appForbiddenName');
        return this.forbiddenName ? forbiddenNameValidator(new RegExp(this.forbiddenName, 'i'))(control) : null;
    }
};

/** A hero's name can't match the hero's alter ego */
export const abcDefValidatorFunction: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const abc = control.get('abc');
    const def = control.get('def');    
    return abc && def && ((!abc.value) && (!def.value)) ? { 'siblingReqError': true } : null;
};
@Directive({
    selector: '[abcDefReqError]',
    providers: [{ provide: NG_VALIDATORS, useExisting: abcDefValidatorFunctionDirective, multi: true }]
})
export class abcDefValidatorFunctionDirective implements Validator {
    validate(control: AbstractControl): ValidationErrors {
        return abcDefValidatorFunction(control)
    }
};