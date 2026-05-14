/**
 * Validates date input fields (day, month, year)
 * @param day - Day value as string or undefined
 * @param month - Month value as string or undefined
 * @param year - Year value as string or undefined
 * @returns Object with field errors or empty object if valid
 */
export const validateDateFields = (
    day: string | undefined,
    month: string | undefined,
    year: string | undefined
): { day?: string; month?: string; year?: string } => {
    const errors: { day?: string; month?: string; year?: string } = {};

    // Check if date fields are provided
    if (!day && !month && !year) {
        // Date is optional, no error
        return errors;
    }

    // Validate day
    if (day) {
        const dayNum = parseInt(day, 10);
        if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
            errors.day = 'Day must be between 1 and 31';
        }
    }

    // Validate month
    if (month) {
        const monthNum = parseInt(month, 10);
        if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
            errors.month = 'Month must be between 1 and 12';
        }
    }

    // Validate year
    if (year) {
        const yearNum = parseInt(year, 10);
        if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
            errors.year = 'Year must be between 1900 and 2100';
        }
    }

    // Check if all date fields are provided
    if ((day || month || year) && (!day || !month || !year)) {
        if (!day) errors.day = 'Enter a day';
        if (!month) errors.month = 'Enter a month';
        if (!year) errors.year = 'Enter a year';
    }

    // Validate date combination (e.g., Feb 30 is invalid)
    if (day && month && year && !errors.day && !errors.month && !errors.year) {
        const dayNum = parseInt(day, 10);
        const monthNum = parseInt(month, 10);
        const yearNum = parseInt(year, 10);
        const testDate = new Date(
            `${yearNum}-${monthNum.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}T00:00:00Z`
        );

        if (testDate.getUTCDate() !== dayNum || testDate.getUTCMonth() + 1 !== monthNum) {
            errors.day = 'Enter a valid date';
        }
    }

    return errors;
};
