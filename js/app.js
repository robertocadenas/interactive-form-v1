/*

-- build-an-interactive-form -- Techdegree -- TeamTreeHoue --
 -- Project 3 -- requirements --

req 1.  Focus on the first field
        1.1 On page load, the cursor appears in the "Name" field, ready for a user to type.
req 2.  A text field that will be revealed when the "Other" option is selected from the "Job Role" drop down menu.
        Give the field an id of “other-title,” and add the placeholder text of "Your Job Role" to the field.
            \\--> We create the field in the HTML, in order to response to no-js context.
            \\--> We put "other-title" without ',' It looks like a typo.
req 3.  For the T-Shirt color menu, only display the color options that match the design selected in the "Design" menu.
            If the user selects "Theme - JS Puns"
                then the color menu should only display "Cornflower Blue," "Dark Slate Grey," and "Gold."
            If the user selects "Theme - I ♥ JS"
                then the color menu should only display "Tomato," "Steel Blue," and "Dim Grey."
req 4.  Some events are at the same time as others. If the user selects a workshop, don't allow selection of a workshop
            at the same date and time -- you should disable the checkbox and visually indicate that the workshop in the competing time slot isn't available.
            When a user unchecks an activity, make sure that competing activities (if there are any) are no longer disabled.
            As a user selects activities, a running total should display below the list of checkboxes. For example, if the user selects "Main Conference", then Total: $200 should appear. If they add 1 workshop, the total should change to Total: $300.
req 5.  Display payment sections based on the payment option chosen in the select menu.
            The "Credit Card" payment option should be selected by default, display the #credit-card div, and hide the "Paypal" and "Bitcoin information.
            When a user selects the "PayPal" payment option, the Paypal information should display, and the credit card and “Bitcoin” information should be hidden.
            When a user selects the "Bitcoin" payment option, the Bitcoin information should display, and the credit card and “PayPal” information should be hidden.
req 6.  If any of the following validation errors exist, prevent the user from submitting the form:
            Name field can't be blank
            Email field must be a validly formatted e-mail address (you don't have to check that it's a real e-mail address, just that it's formatted like one: dave@teamtreehouse.com for example.-
            Must select at least one checkbox under the "Register for Activities" section of the form.
            If the selected payment option is "Credit Card," make sure the user has supplied a credit card number, a zipCode code, and a 3 number CVV value before the form can be submitted.
            Credit card field should only accept a number between 13 and 16 digits
            The zipcode field should accept a 5-digit number
            The CVV should only accept a number that is exactly 3 digits long
req 7. Provide some kind of indication when there’s a validation error.
            The field’s borders could turn red, for example, or a message could appear near the field or at the top of the form
            There should be an error indication for the name field, email field, “Register for Activities” checkboxes, credit card number, zipCode code, and CVV
            If the selected payment option is "Credit Card," make sure the user has supplied a credit card number, a zip code, and a 3 number CVV value before the form can be submitted.
req EXTRA.  Hide the "Color" label --> DONE in req. 3
            Program at least one of your error messages so that more information is provided depending on the error.
                --> DONE in Email and Payment method in req.6 and req. 7
            Program your form so that it provides a real-time validation error message for at least one text input field.
                --> New section, req. EXTRA.

*/


/************************** Elements from HTML **************************/

/* Basic Info */
const name = document.getElementById('name');
const emailUser = document.getElementById('mail');
const otherTitleJob = document.getElementById('other-title');
const titleJob = document.getElementById('title');

/* T-shirt Info */
const designShirt = document.getElementById('design');
const colorShirt = document.getElementById('color');
const colorShirtOptions = document.getElementById('color').children;

/* Register for Activities */
const activities = document.getElementsByClassName('activities')[0];
const activitiesInputs = activities.getElementsByTagName('input');
const totalAmount = document.createElement('div');

/* Payment Info */
const paymentOptions = document.getElementById('payment');
const creditCardDiv = document.getElementById('credit-card');
const paypalDiv = creditCardDiv.nextElementSibling;
const bitcoinDiv = paypalDiv.nextElementSibling;
const ccnum = document.getElementById('cc-num');
const zipCode = document.getElementById('zip');
const cvvCode = document.getElementById('cvv');

/* Button */
const buttonRegister = document.getElementsByTagName('button')[0];

/* Positions for error messages
    We discover them exploring the DOM and comparing Chrome, Mozilla and Safari
    because they don't accept the same elements
    in the apendChild action with labels, inputs... and so on.
    The exception: activities, this element do accept to append a div directly.
    For req. 7.
*/
const belowName = name.parentElement.children[1];
const belowMail = emailUser.parentElement.children[3];
const belowPayment = creditCardDiv.parentElement.children[0];


/************************** Global variables **************************/

let amountTickets = 0;


/************************** DOMContentLoaded **************************/
/** All the code is under DOMContentLoaded. It only launchs after the
    page is loaded **/

document.addEventListener('DOMContentLoaded', () => {

    /************************** req 1. **************************/

    name.focus();


    /************************** req 2. **************************/

    /* Initially hide the fild otherTitleJob */
    otherTitleJob.style.display = 'none';

    /* Only show when user 'change' the drop down menu to select other */
    titleJob.addEventListener('change', (e) => {
        if (e.target.value === 'other') {
            otherTitleJob.style.display = '';
        } else {
            //Reset when the user change the option after selected othert
            otherTitleJob.style.display = 'none';
            otherTitleJob.value = ""; //cleaning - to no sending
        }
    });


    /************************** req 3. **************************/

    document.getElementById('colors-js-puns').style.visibility = 'hidden';

    /*To manage automatically the options in the handler and no follow
     option by option the program set a class for each option reading the content.
     The program look for 'JS Puns' or 'I ♥'' in the text of the options to do this. */
    /* At the same time the program cut this extra text with .slice + .indexOf */
    function renameOptions() {
        for (let i = 0; i < colorShirtOptions.length; i+=1) {
            let colorSOC = colorShirtOptions[i].textContent; //easy management in the next lines
            if (colorSOC.includes('JS Puns')) {
                colorShirtOptions[i].setAttribute('class', 'JSPuns');
                colorShirtOptions[i].textContent = colorSOC.slice(0, colorSOC.indexOf('(JS Puns shirt only)'));
            } else if (colorSOC.includes('I ♥')) {
                colorShirtOptions[i].setAttribute('class', 'heartJS');
                colorShirtOptions[i].textContent = colorSOC.slice(0, colorSOC.indexOf('(I ♥ JS shirt only)'));
            }
        }
    }

    /* At the same time the program cut this extra text with .slice */
    /* The program follow the 3 options with conditionals*/
    designShirt.addEventListener('change', (e) => {
        /* The program needs selected one option ir order to change/hidden
        the anterior option selected because it can be from an option
        not available yet. For this the program use firstSelected
        and manage this in the for loops, inside the design selected previously */
        let firstSelected = 0;
        if (e.target.value  === 'Select Theme') {       /** 1:3 Option Select Theme **/
            document.getElementById('colors-js-puns').style.visibility = 'hidden';
        } else if (e.target.value === 'js puns') {    /** 2:3 Option js puns **/
            document.getElementById('colors-js-puns').style.visibility = '';
            for (let i = 0; i < colorShirtOptions.length; i+=1) {
                if (colorShirtOptions[i].getAttribute('class') === 'JSPuns') {
                    colorShirtOptions[i].hidden = '';
                    // note next option "disabled": we use this option for Safari.
                    // If I don't do that I need to remove and append elements in Safari.
                    // And is better from a UX point of view, because the user sees what options are related.
                    colorShirtOptions[i].disabled = '';
                    if (firstSelected == 0) { /** Changing option selected **/
                        colorShirtOptions[i].selected = 'true';
                        firstSelected += 1;
                    }
                } else {
                    colorShirtOptions[i].hidden = 'true';
                    colorShirtOptions[i].disabled = 'true';
                }
            }
        } else if (e.target.value === 'heart js') { /** 3:3 Option heart js **/
            for (let i = 0; i < colorShirtOptions.length; i+=1) {
                document.getElementById('colors-js-puns').style.visibility = '';
                if (colorShirtOptions[i].getAttribute('class') === 'heartJS' ) {
                    colorShirtOptions[i].hidden = '';
                    colorShirtOptions[i].disabled = ''; //we use this option for Safari
                    if (firstSelected == 0) { /** Changing option selected **/
                        colorShirtOptions[i].selected = 'true';
                        firstSelected += 1;
                    }
                } else {
                    colorShirtOptions[i].hidden = 'true';
                    colorShirtOptions[i].disabled = 'true';
                }
            }
        }
    }); //end listener

    renameOptions();


    /************************** req 4. **************************/

    /** The program send the function the option selected and the option related
    with the same time and date. This match is in the listener. Every time the user
    check or un-checked an option, the listener sends the values to the function manageOptions. this
    disabled or enable the related option. **/
    /** At the same time the program create and append the message **/

    function manageOptions(selected, related) {
        if(activitiesInputs[selected].checked == true) {
            // First, disable the event at the same time
            activitiesInputs[related].disabled = true;
            // Second, add message
            let newNoAvailable = document.createElement('div');
            newNoAvailable = formatMessageActivities(newNoAvailable);
            activitiesInputs[related].parentElement.appendChild(newNoAvailable);
        } else {
            // First, enable the event at the same time
            activitiesInputs[related].disabled = false;
            // Second, delete message
            if (activitiesInputs[related].parentElement.getElementsByTagName('div')[0]) {
                let NoAvailableChild = activitiesInputs[related].parentElement.getElementsByTagName('div')[0];
                activitiesInputs[related].parentElement.removeChild(NoAvailableChild);
            }
        }
    }

    /** the fortmat of the message. The visual aspects and text **/
    function formatMessageActivities (elementHTML) {
        elementHTML.style.background = 'lightblue';
        elementHTML.style.borderBottom = '2px solid lightSlateGray';
        elementHTML.style.lineHeight = 1.5;
        elementHTML.style.paddingLeft = '5px';
        elementHTML.style.marginLeft = '20px';
        elementHTML.style.fontStyle = 'italic';
        elementHTML.textContent = "The workshop in the competing time slot isn't available.";
        return elementHTML;
    }

    /** The function add o subtact what the listener send to it.
     It uses a global variable amountTickets **/
    function calculateAmount(selected, amount) {
        if(activitiesInputs[selected].checked == true) {
            // if true, we add
            amountTickets += parseInt(amount);
        } else {
            // if false, we subtract
            amountTickets -= parseInt(amount);
        }
    }

    /* DATA to follo the conditions. From the HTML code.
    activitiesInputs[1] -- > name="all"
    activitiesInputs[2] -- > name="js-frameworks"
    activitiesInputs[3] -- > name="js-libs"
    activitiesInputs[4] -- > name="express"
    activitiesInputs[5] -- > name="node"
    activitiesInputs[6] -- > name="build-tools"
    activitiesInputs[7] -- > name="npm"
    */

    activities.addEventListener('click', (e) => {
        // First we manage the checkboxes and the messages
        if (e.target.name === 'all') {
            calculateAmount(0, 200);
            totalAmount.textContent += ' ' + amountTickets;
        } else if (e.target.name === 'js-frameworks') {
            manageOptions(1, 3);
            calculateAmount(1, 100);
            totalAmount.textContent += ' ' + amountTickets;
        } else if (e.target.name === 'js-libs') {
            manageOptions(2, 4);
            calculateAmount(2, 100);
        } else if (e.target.name === 'express') {
            manageOptions(3, 1);
            calculateAmount(3, 100);
        } else if (e.target.name === 'node') {
            manageOptions(4, 2);
            calculateAmount(4, 100);
        } else if (e.target.name === 'build-tools') {
            calculateAmount(5, 100);
        } else if (e.target.name === 'npm') {
            calculateAmount(6, 100);
        }
        // Second we paint the message about $
        totalAmount.textContent = 'TOTAL: $' + amountTickets;
        formatMessageTotalAmount();
        activities.appendChild(totalAmount);

        /** the fortmat of the total amount.
        The program use a const for the div of total amount in order to assign
        te calculate amount and no create, append or delete every time the sum
         or subtract change **/
        function formatMessageTotalAmount () {
            totalAmount.style.background = 'LightCyan';
            totalAmount.style.borderBottom = '3px solid gold';
            totalAmount.style.lineHeight = 1.5;
            totalAmount.style.paddingRight = '25px';
            totalAmount.style.marginLeft = '20px';
            totalAmount.style.fontStyle = 'italic';
            totalAmount.style.textAlign = 'right';
        }

    });// end activities listener


    /************************** req 5. **************************/

    /* First program pick the first option paymentOptions[1] (credit card) of the drop down menu
    and assign the select.
      Second, the program manage the display of the divs with the payment information.
      */
    function initPayment(){
        paymentOptions[1].selected = true;
        //we use nextElementSibling because the divs don't have id or class in the HTML
        displayPayment (creditCardDiv);
        /* creditCardDiv.style.display = '';
        paypalDiv.style.display = 'none';
        bitcoinDiv.style.display = 'none'; */
    }

    /* with this function the program reduce the code. divPayment can sustitute each of three:
    creditCardDiv, paypalDiv, bitcoinDiv */
    function displayPayment (divPayment) {
        //first reset
        creditCardDiv.style.display = 'none';
        paypalDiv.style.display = 'none';
        bitcoinDiv.style.display = 'none';
        //second assign
        divPayment.style.display = '';
    }

    /* The listener change the display of the element when the user change the selected option */
    payment.addEventListener('change', (e) => {
        if (e.target.value === 'credit card') {
            displayPayment (creditCardDiv);
        } else if (e.target.value === 'paypal') {
            displayPayment (paypalDiv);
        } else if (e.target.value === 'bitcoin') {
            displayPayment (bitcoinDiv);
        }
        //every time the user change the payment method, the error messages need to be cleaned.
        //The same to the content.
        //See req. 6 and req. 7
        cleanErrorMessage(ccnum);
        cleanErrorMessage(zipCode);
        cleanErrorMessage(cvvCode);
        ccnum.value = "";
        zipCode.value = "";
        cvvCode.value = "";
    });// end paymennt listener

    initPayment();


    /************************** req 6. **************************/

    /**** note: cleanErrorMessage() and errorIndication() are from REQ. 7;
    They are call from here to no duplicate the code, be DRY :-)
    The functions return true/false in order to validate all the form
    in the listener.
    **/

    /** Name field can't be blank **/
    //
    function isOkName() {
        if (name.value !== "") {
            cleanErrorMessage(name);
            return true;
        } else {
            errorIndication(name);
            return false;
        }
    }

    /** Email field must be a validly formatted.
    The program evaluate sequentially
        - no empty
        - have @
        - have '.'
        - have no blank space
        In a extra block:
        - have a good format: alias @ domain dot tld
            - Text before @
            - Text before the '.' after the @
            - Text after the '.'
    Every time the program checks a possible error, it cleans possible error messages previous.
    Thinking the user can fixes an error and the same time he breaks old good content.
     **/
    function isOkEmail() {

        //The program looks there is the right format.
        let indexOfAt = emailUser.value.indexOf('@');
        let textBeforeAt = emailUser.value.slice(0, indexOfAt);
        let textAfterAt = emailUser.value.slice(indexOfAt+1, emailUser.value.length);
        let indexOfDot = textAfterAt.indexOf('.');
        let textBeforeDot = textAfterAt.slice(0, indexOfDot);
        let textAfterDot = textAfterAt.slice(indexOfDot+1, emailUser.value.length);

        //fThe program that there are all the elements and later the right format
        if (emailUser.value === "") {
            clearAllEmailErrors();
            errorIndication(emailUser, 'email_mailEmpty_EM');
            okEmail = false;
        } else if (!emailUser.value.includes('@')) {
            clearAllEmailErrors();
            errorIndication(emailUser, 'email_no_At_EM');
            return false;
        } else if(textAfterAt.length == 0 || (textAfterAt.length == 1 && indexOfDot == 0)) {
            clearAllEmailErrors();
            errorIndication(emailUser, 'email_no_domain_EM');
            return false;
        } else if (!emailUser.value.includes('.')) {
            clearAllEmailErrors();
            errorIndication(emailUser, 'email_no_dot_EM');
            return false;
        } else if (emailUser.value.includes(' ')) {
            clearAllEmailErrors();
            errorIndication(emailUser, 'email_blank_Space_EM');
            return false;
        } else if (textBeforeAt.length === 0) {
            clearAllEmailErrors();
            errorIndication(emailUser, 'email_bad_Format_EM');
            return false;
        } else if (textBeforeDot.length === 0) {
            clearAllEmailErrors();
            errorIndication(emailUser, 'email_bad_Format_EM');
            return false;
        } else if (textAfterDot.length === 0) {
            clearAllEmailErrors();
            errorIndication(emailUser, 'email_bad_Format_EM');
            return false;
        } else {
            clearAllEmailErrors();
            return true;
        }
    } //End isOkEmail()

    /** The program review all possible messages because the user can
     do and undo every step no sequentially **/
    function clearAllEmailErrors(){
        cleanErrorMessage(emailUser, 'email_mailEmpty_EM');
        cleanErrorMessage(emailUser, 'email_no_At_EM');
        cleanErrorMessage(emailUser, 'email_no_domain_EM');
        cleanErrorMessage(emailUser, 'email_no_dot_EM');
        cleanErrorMessage(emailUser, 'email_blank_Space_EM');
        cleanErrorMessage(emailUser, 'email_bad_Format_EM');
    }

    /** Must select at least one checkbox under the "Register for Activities" **/
    /** The program run all the checkbox searching the checked **/
    function isOkActivities() {
        for (let i = 0; i<activitiesInputs.length; i+=1 ) {
            if (activitiesInputs[i].checked) {
                cleanErrorMessage(activities);
                return true;
            }
        }
        errorIndication(activities);
        return false;
    }

    /** selected payment option is "Credit Card," with its content and right format **/
    /** Credit card validation
         - only accept a number between 13 and 16 digits.
    The program checks it is a number with the condition isNaN(parseInt(ccnum.value)+2) // with a leter
    it returns a NaN.
        (We don't know how to use regular expresions yet to validate number digits
        and don't want to paste external code)
    The program also checks it doesn't have blank spaces
    **/
    function isOkCcnum() {
        if ((ccnum.value.length < 13 || ccnum.value.length > 16) || isNaN(parseInt(ccnum.value)+2) || ccnum.value == "") {
            errorIndication(ccnum);
            return false;
        } else if (ccnum.value.includes(' ')) {
            cleanErrorMessage(ccnum);
            errorIndication(ccnum);
            return false;
        } else {
            cleanErrorMessage(ccnum);
            cleanErrorMessage(ccnum);
            return true;
        }
    }

    /** Zip code validation
        The program also checks it doesn't have blank spaces **/
    function isOkzipCode() {
        //we control de length and the digits were numbers matching their value
        // >9999 --> 5 digits or more && < 100000 less than 5 digits
        if (zipCode.value > 9999 && zipCode.value < 100000 ) {
            cleanErrorMessage(zipCode);
            return true;
        } else if (ccnum.value.includes(' ')) {
            cleanErrorMessage(zipCode);
            errorIndication(zipCode);
            return false;
        } else {
            errorIndication(zipCode);
            return false;
        }
    }

    /** CVV validation
        The program also checks it doesn't have blank spaces **/
    function isOkCvv() {
        if (cvvCode.value.length == 3 && cvvCode.value > 99 && cvvCode.value < 1000 ) {
            cleanErrorMessage(cvvCode);
            return true;
        }
        errorIndication(cvvCode);
        return false;
    }

    /** The program manage all possible errors from here.
        It cuts the event with preventDefault() util all conditions are true.
        Only if all is ok, it can send the form. **/
    buttonRegister.addEventListener('click', (e) =>{
        //Review all the conditions
        //e.preventDefault();
        let OkName = isOkName();
        let OkEmail = isOkEmail();
        let OkActivities = isOkActivities();
        let okForm = OkName && OkEmail && OkActivities;
        //The program check the credit card if it is selected
        if (paymentOptions[1].selected == true) {
            let OkCcnum = isOkCcnum();
            let OkzipCode= isOkzipCode();
            let OkCvv = isOkCvv();
            okForm = OkName && OkEmail && OkActivities && OkCcnum && OkzipCode && OkCvv;
        }
        //Cut the event if all isn't right
        if (!okForm) {
            e.preventDefault();
            console.log('form no completed');
        /* In case you want to test the form completed without sending.
            } else {
            e.preventDefault();
            console.log('GREAT! form completed');
        */
        }
    });


    /************************** req 7. **************************/

    /** The program create the messages like const
        These messages are used in errorIndication()
        It puts the class 'errorMessage' to identify them in the cleaning, cleanErrorMessage()
        Remember that errorIndication() and cleanErrorMessage() was calling in the functions
        of req. 6. isOk...()
     **/
    /** name error **/
    const name_EM = document.createElement('div');
    name_EM.textContent = 'The name field must have data';
    name_EM.setAttribute('class', 'errorMessage');

    /** emails errors **/
    //No data
    const email_mailEmpty_EM = document.createElement('div');
    email_mailEmpty_EM.textContent = 'The email field must have data';
    email_mailEmpty_EM.setAttribute('class', 'errorMessage');
    //No @
    const email_no_At_EM = document.createElement('div');
    email_no_At_EM.textContent = 'The email field must have @.';
    email_no_At_EM.setAttribute('class', 'errorMessage');
    //No domain
    const email_no_domain_EM = document.createElement('div');
    email_no_domain_EM.textContent = 'The email field must have a domain.';
    email_no_domain_EM.setAttribute('class', 'errorMessage');
    //No dot
    const email_no_dot_EM = document.createElement('div');
    email_no_dot_EM.textContent = 'The email field must have a dot before the tld';
    email_no_dot_EM.setAttribute('class', 'errorMessage');
    //Blak spaces
    const email_blank_Space_EM = document.createElement('div');
    email_blank_Space_EM.textContent = 'The email field must not have blank spaces';
    email_blank_Space_EM.setAttribute('class', 'errorMessage');
    //Wrong format
    const email_bad_Format_EM = document.createElement('div');
    email_bad_Format_EM.textContent = 'The email must have this format: "alias@domain.tld"';
    email_bad_Format_EM.setAttribute('class', 'errorMessage');

    /** Activities error **/
    const activities_EM = document.createElement('div');
    activities_EM.textContent = 'You must select at least one checkbox';
    activities_EM.setAttribute('class', 'errorMessage');

    /** Payment errors **/
    //Credit Card
    const ccnum_EM = document.createElement('div');
    ccnum_EM.textContent = 'The credit card field should have 13 and 16 digits';
    ccnum_EM.setAttribute('class', 'errorMessage');
    ccnum_EM.setAttribute('id', 'ccnum_EM');
    //Zip Code
    const zipCode_EM = document.createElement('div');
    zipCode_EM.textContent = 'The Zip Code field should have 5 digits';
    zipCode_EM.setAttribute('class', 'errorMessage');
    zipCode_EM.setAttribute('id', 'zipCode_EM');
    //CVV Code
    const cvvCode_EM = document.createElement('div');
    cvvCode_EM.textContent = 'The CVV Code field should have 3 digits';
    cvvCode_EM.setAttribute('class', 'errorMessage');
    cvvCode_EM.setAttribute('id', 'cvvCode_EM');

    /** With the elementERR the program identifies the elemnt with an error,
     and in case the element has some types of errors, the program receive the appropiate with typeErr.
     The program use the better HTML tag/parent available in index.html to append the element.
     They are defined like constant and the begining of the script.
      **/
    function errorIndication (elementERR, typeErr) {
        //Name error
        if (elementERR == name) {
            belowName.appendChild(name_EM);
        }
        //Email errors
        if (elementERR == emailUser && typeErr == 'email_mailEmpty_EM') {
            //emailUser.labels[0].appendChild(email_mailEmpty_EM);
            belowMail.appendChild(email_mailEmpty_EM);
        } else if (elementERR == mail && typeErr == 'email_no_At_EM') {
            belowMail.appendChild(email_no_At_EM);
        } else if (elementERR == mail && typeErr == 'email_no_domain_EM') {
            belowMail.appendChild(email_no_domain_EM);
        } else if (elementERR == mail && typeErr == 'email_no_dot_EM') {
            belowMail.appendChild(email_no_dot_EM);
        } else if (elementERR == mail && typeErr == 'email_blank_Space_EM') {
            belowMail.appendChild(email_blank_Space_EM);
        } else if (elementERR == mail && typeErr == 'email_bad_Format_EM') {
            belowMail.appendChild(email_bad_Format_EM);
        }
        //Activities errors
        if (elementERR == activities) {
            activities.appendChild(activities_EM);
        }
        //Payment errors
        //we use a  parente - parent Div because visually is better
        //and we don't have another option without change the HTML
        if (elementERR == ccnum) {
            belowPayment.insertBefore(ccnum_EM, belowPayment.firstElementChild)
        }
        if (elementERR == zipCode) {
            belowPayment.insertBefore(zipCode_EM, belowPayment.firstElementChild)
        }
        if (elementERR == cvvCode) {
            belowPayment.insertBefore(cvvCode_EM, belowPayment.firstElementChild)
        }
        //Finally, the visual touch
        formatErrorIndications(elementERR);
    }

    /** Visual touch for the HTML element that has the error message **/
    function formatErrorIndications(elementERR) {
        /** first the format of inpunt elements, but not the div of checkbox, the effect is ugly.
        And no all checkbox are mandatory.
        With this, the user can locate easily the elements with errors **/
        if (elementERR !== activities) {
            elementERR.style.borderBottom = '3px solid red';
        }

        /** Second the format of the error meesages **/
        const errorMessages = document.getElementsByClassName('errorMessage');
        for (let i = 0; i < errorMessages.length; i+= 1) {
            errorMessages[i].style.background = 'lightblue';
            errorMessages[i].style.borderLeft = '6px solid red';
            errorMessages[i].style.marginBottom = '5px';
            errorMessages[i].style.paddingLeft = '5px';
            errorMessages[i].style.lineHeight = 1.5;
            errorMessages[i].style.color = 'black';
            errorMessages[i].style.fontSize = '14px';
            errorMessages[i].style.fontWeight = 500;
        }
    }

    /** The program cleans the error mensages that doesn't apply anymore.
        Like errorIndication(),  cleanErrorMessage() manage two arguments according to
        the number of error messages the element.
        Before cleaning the program reviews if (the element is there) looking where it previously appends them.
        Look first section of req. 7
         **/

         //const belowName = name.parentElement.children[1];
         //const belowMail = emailUser.parentElement.children[3];
         //const belowPayment = creditCardDiv.parentElement.children[0];

    function cleanErrorMessage (elementERR, typeErr) {
        // name.labels[0].children looking if it has children, messages previous
        if (elementERR == name && belowName.children.length > 0) {
            belowName.removeChild(belowName.getElementsByClassName('errorMessage')[0]);
        } else if (elementERR == emailUser && belowMail.children.length > 0) {
            belowMail.removeChild(belowMail.getElementsByClassName('errorMessage')[0]);
        } else if (elementERR == activities && activities.getElementsByClassName('errorMessage')[0]) {
            activities.removeChild(activities.getElementsByClassName('errorMessage')[0]);
        } else if ((elementERR == ccnum) && document.getElementById('ccnum_EM')) {
            belowPayment.removeChild(document.getElementById('ccnum_EM'));
        } else if ((elementERR == zipCode) && document.getElementById('zipCode_EM')) {
            belowPayment.removeChild(document.getElementById('zipCode_EM'));
        } else if ((elementERR == cvvCode) && document.getElementById('cvvCode_EM')) {
            belowPayment.removeChild(document.getElementById('cvvCode_EM'));
        }

        cleanFormatErrorMessages (elementERR)
    }

    /* Cleaning the format create in formatErrorIndications() */
    function cleanFormatErrorMessages (elementERR) {
        elementERR.style.borderBottom = '';
    }


    /************************** req 7. **************************/

    /** The program review  all the form with each key up or click.
    Activities needs click.
    **/

    emailUser.addEventListener('keyup', () => {
        isOkName();
    });

    emailUser.addEventListener('keyup', () => {
        isOkEmail();
    });

    activities.addEventListener('click', () => {
        isOkActivities();
    });

    creditCardDiv.addEventListener('keyup', () => {
        isOkCcnum();
        isOkzipCode();
        isOkCvv();
    });


}); //end main listner DOMContentLoaded
