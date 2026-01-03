export class CustomValidator {

    // @ts-ignore
    static passwordValidator(pass): any {
        if (pass.pristine) {
            return null;
        }
        let UC_REG = /^(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{1,25}$/
        let LC_REG = /^(?=.*[a-z])[a-zA-Z0-9!@#$%^&*]{1,25}$/
        let NU_REG = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{1,25}$/
        let SP_REG = /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{1,25}$/
        pass.markAsTouched();
        if (!UC_REG.test(pass.value)) {
            return {
                invalidPassword: true
            }
        }
        if (!LC_REG.test(pass.value)) {
            return {
                invalidPassword: true
            }
        }
        if (!NU_REG.test(pass.value)) {
            return {
                invalidPassword: true
            }
        }
        if (!SP_REG.test(pass.value)) {
            return {
                invalidPassword: true
            }
        }
        if (!(pass.value.length > 7)) {
            return {
                invalidPassword: true
            }
        }
        return null;
    }
    // @ts-ignore
static panValidator(pan): any {
    // if (pan.pristine) {
    //     return null;
    // }
    const PAN_REGEXP = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    pan.markAsTouched();
    if (PAN_REGEXP.test(pan.value)) {
        return null;
    }
    return {
        invalidPAN: true
    };
}

// @ts-ignore
static aadharValidator(aadhar): any {
    /* if (aadhar.pristine) {
        return null;
    } */
    const AADHAR_REGEXP = /^[2-9]{1}\d{3}(\s)?\d{4}(\s)?\d{4}$/;
    aadhar.markAsTouched();
    if (AADHAR_REGEXP.test(aadhar.value)) {
        return null;
    }
    return {
        invalidAadhar: true
    };
}

// @ts-ignore
static drivingLicenceValidator(dl): any {
    /* if (dl.pristine) {
        return null;
    } */
    const DL_REGEXP = /^(([A-Z]{2}[0-9]{2})|([A-Z]{2}-[0-9]{2}))(\d)?((19|20)[0-9]{2})[0-9]{7}$/;
    dl.markAsTouched();
    if (DL_REGEXP.test(dl.value)) {
        return null;
    }
    return {
        invalidDL: true
    };
}

// @ts-ignore
static passportValidator(passport): any {
    /* if (passport.pristine) {
        return null;
    } */
    const PASSPORT_REGEXP = /^[A-Z][1-9]\d{6}$/;
    passport.markAsTouched();
    if (PASSPORT_REGEXP.test(passport.value)) {
        return null;
    }
    return {
        invalidPassport: true
    };
}

// @ts-ignore
static cinValidator(CIN): any {
    /* if (passport.pristine) {
        return null;
    } */
    const CIN_REGEX =  /^([LUu]{1})([0-9]{5})([A-Za-z]{2})([0-9]{4})([A-Za-z]{3})([0-9]{6})$/;
    CIN.markAsTouched();
    if (CIN_REGEX.test(CIN.value)) {
        return null;
    }
    return {
        invalidCIN: true
    };
}

// @ts-ignore
static voterIDValidator(voterID): any {
    /* if (passport.pristine) {
        return null;
    } */
    const VOTERID_REGEX =  /^([a-zA-Z]){3}([0-9]){7}?$/;
    voterID.markAsTouched();
    if (VOTERID_REGEX.test(voterID.value)) {
        return null;
    }
    return {
        invalidVoterID: true
    };
}

// @ts-ignore
static gstValidator(GSTIN): any {
    /* if (passport.pristine) {
        return null;
    } */
    const GSTIN_REGEX =  /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/;
    
    GSTIN.markAsTouched();
    if (GSTIN_REGEX.test(GSTIN.value)) {
        return null;
    }
    return {
        invalidCIN: true
    };
}


// @ts-ignore
static emailValidator(EMAIL): any {
    if (EMAIL.pristine) {
        return null;
    } 
    const EMAIL_REGEX =  /^(?!.{100})[a-zA-Z0-9_]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,6}$/;
    
    EMAIL.markAsTouched();
    if (EMAIL_REGEX.test(EMAIL.value)) {
        return null;
    }
    return {
        invalidEmail: true
    };
}

// @ts-ignore
static phoneValidator(PHONE): any {
    if (PHONE.pristine) {
        return null;
    } 
    const PHONE_REGEX =  /^[6-9][0-9]{9}$/;
    
    PHONE.markAsTouched();
    if (PHONE_REGEX.test(PHONE.value)) {
        return null;
    }
    return {
        invalidNumber: true
    };
}

// @ts-ignore
static industryName(name): any {
    const INDUSTRYNAME_REGEX =  /^[ A-Za-z0-9.\\\-()]*$/;
    
    name.markAsTouched();
    if (INDUSTRYNAME_REGEX.test(name.value)) {
        return null;
    }
    return {
        invalidNumber: true
    };
}

// @ts-ignore
static name(name): any {
    const NAME_REGEX =  /^[A-Z @~`!@#$%^&*()_=+\\\\';:\"\\/?>.<,-]*$/i;
    
    name.markAsTouched();
    if (NAME_REGEX.test(name.value)) {
        return null;
    }
    return {
        invalidName: true
    };
}

}