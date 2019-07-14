class BoolString {

    ToYesNo(string) {
        if (string.toString().toLowerCase() == 'true') {
            return 'Y';
        } else {
            return 'N';
        }
    }
    YesNoToBoolean(string) {
        if (string.toLowerCase() == 'y') {
            return true;
        } else {
            return false;
        }
    }

}

module.exports = new BoolString();