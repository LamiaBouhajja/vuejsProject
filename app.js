/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap')
window.Vue = require('vue')

Vue.use(require('vue-resource'))

import VueSession from 'vue-session'
Vue.use(require('vue-session'))

const VueScrollTo = require('vue-scrollto')
Vue.use(VueScrollTo)
var dropin = require('braintree-web-drop-in');


import VueRouter from 'vue-router';

Vue.use( VueRouter );

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

import Datepicker from 'vuejs-datepicker';
import Multiselect from 'vue-multiselect';
import moment from 'moment';

// require("vue2-scrollbar/dist/style/vue2-scrollbar.css")
// require("vue2-scrollbar/dist/style/app.css")
import VueScrollbar from 'vue2-scrollbar';

Vue.component('datepicker', require('./components/datepicker.vue'));
Vue.component('example', require('./components/Example.vue'));
// Vue.component('vuescrollbar', require('./components/vuescrollbar.vue'));


Vue.http.headers.common['X-CSRF-TOKEN'] = $("[name='_token']").attr("value");
const app = new Vue({
    el: '#app',
    data: {
        popupsView: false,
        profilView: true,
        credentialsView: false,
        objectifView: false,
        alimentaireView: false,
        /* Abonnements vars */
        mesAbonnementsView: true,
        configPaypalView: false,
        /* End of Abonnements vars */
        simpleUser: true,
        coachList: false,
        authUser: {
            'first_name': '',
            'last_name': '',
            'email': '',
            'password': '',
            'password_confirmation': '',
            'picture': '',
            'gender': '',
            'birthday': '',
            'taille': '',
            'poid': '',
            'objectif': '',
            'imc': '',
            'objectifImc' : '',
            'account': 1,
            'program': '',
            // 'sousProgram': '',
            'dedline': '',
            'time_plunning': [],
            'food_plunning': [],
            'groups' : null,
            'patientMail' : '',
            'price': '',
            'selectOffer': '',
            'societe' :'',
            'sport_name' :'',
            'level' :'',
            'siret' :'',
            'profil_percent' :'',
            'experience' : '',
            /* SALLEs DE SPORT */
            'societe_name' : '',
            'societe_desc' : '',
            'societe_address' : '',

            /* updatePaypalAcount */
            'paypal_merchant_id' : '',
            'paypal_public_key' : '',
            'paypal_private_key' : ''
        },
        // sousPrograms: [
        //     {
        //         'id': '',
        //         'label':''
        //     }
        // ],
        specialist: {
            'url': '',
            'name': '',
        },
        response: {},
        formErrors: {},
        formErrorsUpdate: {},
        confirmMsg: {},
        language: "fr",
        value: null,
        defaultDays: {day: "Lundi"},
        daysPlanning: [
            {day: "Lundi"},
            {day: "Mardi"},
            {day: "Mercredi"},
            {day: "Jeudi"},
            {day: "Vendredi"},
            {day: "Samedi"},
            {day: "Dimanche"},

        ],
        defaultHours: {hour: "08"},
        hoursPlanning: [
            {hour: "08"},
            {hour: "09"},
            {hour: "10"},
            {hour: "11"},
            {hour: "12"},
            {hour: "13"},
            {hour: "14"},
            {hour: "15"},
            {hour: "16"},
            {hour: "18"},
            {hour: "19"},
            {hour: "20"},
            {hour: "21"},
            {hour: "22"},
        ],
        defaultMinutes: {minute: "00"},
        minutesPlanning: [
            {minute: "00"},
            {minute: "15"},
            {minute: "30"},
            {minute: "45"},
        ],
        birthdayState: {
            disabled: {
                from: new Date(), // Disable all dates up to specific date
            },
            highlighted: {
                dates: [ // Highlight an array of dates
                    new Date()
                ]
            }
        },
        delineState: {
            disabled: {
                to: new Date(), // Disable all dates up to specific date
            },
            highlighted: {
                dates: [ // Highlight an array of dates
                    new Date()
                ]
            }
        },
        dayFood : {},
        plunningShow: null
    },
    components: {
        datepicker: Datepicker,
        multiselect: Multiselect,
        moment: moment,
        vuescrollbar: VueScrollbar
    },
    mounted: function () {
        this.getAuthUser();
    },
    methods: {
        DateFormatter(date) {
            return moment(date).format('DD-MM-YYYY');
        },
        getAuthUser: function () {
            this.$http.get("/jslim/getAuthUser").then((response) => {

                console.log(response.data.time_plunning);
                console.log(response.data.food_plunning);

                this.authUser.email = response.data.email;
                (!response.data.picture) ? this.authUser.picture = "public/img/user.png" : this.authUser.picture = response.data.picture;


                this.authUser.gender = response.data.gender;
                this.authUser.birthday = response.data.birthday;
                this.authUser.taille = response.data.taille;
                this.authUser.poid = response.data.poid;
                this.authUser.objectif = response.data.objectif;
                this.authUser.program = response.data.program;
                this.authUser.dedline = response.data.dedline;
                this.authUser.account = response.data.account_type;
                this.authUser.groups = response.data.groups;

                this.authUser.societe = response.data.societe;
                this.authUser.sport_name = response.data.sport_name;
                this.authUser.level = response.data.level;
                this.authUser.experience = response.data.experience;
                this.authUser.siret = response.data.siret;
                this.authUser.public = response.data.public;


                this.authUser.paypal_merchant_id = response.data.paypal_merchant_id;
                this.authUser.paypal_public_key = response.data.paypal_public_key;
                this.authUser.paypal_private_key = response.data.paypal_private_key;

                (!response.data.time_plunning) ? this.authUser.time_plunning = [] : this.authUser.time_plunning = response.data.time_plunning;
                (!response.data.food_plunning) ? this.authUser.food_plunning = [] : this.authUser.food_plunning = response.data.food_plunning;
                (response.data.taille && response.data.poid) ? this.authUser.imc = this.authUser.poid / Math.pow((this.authUser.taille / 100), 2) : this.authUser.imc = '';
                (response.data.taille && response.data.objectif) ? this.authUser.objectifImc = this.authUser.objectif / Math.pow((this.authUser.taille / 100), 2) : this.authUser.objectifImc = '';

                this.completeProfilPercent();

            }, (response) => {
                console.log(response.data);
            });
        },
        completeProfilPercent : function () {
            /**
             * Calcule de poucentage de complétude du profil
             */

            if(this.authUser.account <= 1){
                var completed = 7;


                if ((this.authUser.taille) && (this.authUser.taille != '')) completed++;
                if ((this.authUser.poid) && (this.authUser.poid != '')) completed++;
                if ((this.authUser.objectif) && (this.authUser.objectif != '')) completed++;
                if (this.authUser.groups != null) completed++;
                if ((this.authUser.dedline) && (this.authUser.dedline != '')) completed++;
                if ((this.authUser.time_plunning) && (this.authUser.time_plunning != '')) completed++;
                this.authUser.profil_percent = Math.round((completed * 100) / 13);

            }

            if(this.authUser.account == 2){
                var completed = 12;
                if ((this.authUser.birthday) && (this.authUser.birthday != '')) completed++;
                if ((this.authUser.time_plunning) && (this.authUser.time_plunning != '')) completed++;
                this.authUser.profil_percent = Math.round((completed * 100) / 14);

            }

            if(this.authUser.account == 3){
                var completed = 8;
                if ((this.authUser.birthday) && (this.authUser.birthday != '')) completed++;
                if ((this.authUser.time_plunning) && (this.authUser.time_plunning != '')) completed++;
                this.authUser.profil_percent = Math.round((completed * 100) / 10);

            }
            if(this.authUser.account == 4){
                var completed = 6;

                this.authUser.profil_percent = 100;

            }

            $("#profil_percent").css("width", this.authUser.profil_percent+"%");
        },
        registerForm: function () {
            if((this.authUser.account == 2) || (this.authUser.account == 3) || (this.authUser.account == 4)){
                $("form#registerForm").toggleClass('fadeInUp fadeOutDown');
                $(".specialist.panel").removeClass('panel-default').addClass('panel-success');
                $(".patient.panel").removeClass('panel-success').addClass('panel-default');

                setTimeout(function(){$("form#registerForm").toggleClass('fadeInUp fadeOutDown')}, 250);

                // $(".price-group, .coach-input").css("display", "block").removeClass('fadeOutDown').addClass('fadeInUp animated');

                // $(".submit-group").removeClass('fadeInUp').addClass('fadeOutDown');
                // setTimeout(function(){$(".submit-group").css("display", "none")}, 1000);
            }else{
                $("form#registerForm").toggleClass('fadeInUp fadeOutDown');
                $(".patient.panel").removeClass('panel-default').addClass('panel-success');
                $(".specialist.panel").removeClass('panel-success').addClass('panel-default');
                setTimeout(function(){$("form#registerForm").toggleClass('fadeInUp fadeOutDown')}, 250);

                // $(".price-group, .coach-input").removeClass('fadeInUp').addClass('fadeOutDown');
                // setTimeout(function(){$(".price-group, .coach-input").css("display", "none")}, 1000);

                // $(".submit-group").css("display", "block").removeClass('fadeOutDown').addClass('fadeInUp animated');
            }
        },
        updateCredentials: function () {
            if ((this.authUser.email !== "") || (this.authUser.password !== "")) {
                this.$http.post("/jslim/updateCredentials", this.authUser).then((response) => {
                    //GOOD
                    if (response.ok == true) {
                        this.formErrors = false;
                        this.confirmMsg['error'] = false;
                        this.confirmMsg['success'] = response.data;
                    }

                }, (response) => {
                    if (response.ok == false) {
                        this.confirmMsg['success'] = false;
                        this.confirmMsg['error'] = "Veuillez vérifier vos informations";
                        this.formErrors = response.data;
                    }

                });
                setTimeout(function () {
                    this.confirmMsg = {}
                }, 2000);
            }
            VueScrollTo.scrollTo("#app");
        },
        daysLabel (option) {
            return `${option.day}`
        },
        hoursLabel (option) {
            return `${option.hour}`
        },
        minutesLabel (option) {
            return `${option.minute}`
        },
        addPlanning: function () {
            if (!this.authUser.time_plunning.includes(this.defaultDays.day + " à " + this.defaultHours.hour + "h:" + this.defaultMinutes.minute + " min")) {
                this.authUser.time_plunning.push(this.defaultDays.day + " à " + this.defaultHours.hour + "h:" + this.defaultMinutes.minute + " min");
            }
            this.authUser.time_plunning.sort();
            console.log(this.authUser.time_plunning);
        },
        deletePlanning: function (i) {
            Vue.delete(this.authUser.time_plunning, i);
        },
        updateProfilSportif: function () {

            this.$http.post("/jslim/updateProfilSportif", this.authUser).then((response) => {
                //GOOD
                if (response.ok == true) {
                    this.formErrors = false;
                    this.confirmMsg['error'] = false;
                    this.confirmMsg['success'] = response.data;
                }
                this.completeProfilPercent();
            }, (response) => {
                if (response.ok == false) {
                    this.confirmMsg['success'] = false;
                    this.formErrors = response.data;
                    this.confirmMsg['error'] = "Veuillez vérifier vos informations";
                }
            });
            setTimeout(function () {
                this.confirmMsg = {};
            }, 2000);
            VueScrollTo.scrollTo("#app");
        },
        updateProfilAlimentaire: function () {
            // this.authUser.food_plunning
            this.$http.post("/jslim/updateProfilAlimentaire", this.authUser).then((response) => {
                //GOOD
                if (response.ok == true) {
                    this.formErrors = false;
                    this.confirmMsg['error'] = false;
                    this.confirmMsg['success'] = response.data;
                }

            }, (response) => {
                if (response.ok == false) {
                    this.confirmMsg['success'] = false;
                    this.formErrors = response.data;
                    this.confirmMsg['error'] = "Veuillez vérifier vos informations";
                }
            });
            setTimeout(function () {
                this.confirmMsg = {};
            }, 2000);
            VueScrollTo.scrollTo("#app");
        },
        updatePatientAlimentaire: function () {
            // this.authUser.food_plunning
            this.authUser.patientMail = $("#patientMail").val();
            this.$http.post("/jslim/updatePatientAlimentaire", this.authUser).then((response) => {
                //GOOD
                if (response.ok == true) {
                    this.formErrors = false;
                    this.confirmMsg['error'] = false;
                    this.confirmMsg['success'] = response.data;
                }

            }, (response) => {
                if (response.ok == false) {
                    this.confirmMsg['success'] = false;
                    this.formErrors = response.data;
                    this.confirmMsg['error'] = "Veuillez vérifier vos informations";
                }
            });
            setTimeout(function () {
                this.confirmMsg = {};
            }, 2000);
            VueScrollTo.scrollTo("#app");
        },
        scrollTop: function () {
            VueScrollTo.scrollTo("#app");
        },
        onImageChange: function (e) {
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length)
                return;
            this.createImage(files[0]);
        },
        cropperImage: function () {
            this.authUser.picture =  $(".img-container > img").cropper('getCroppedCanvas').toDataURL('image/jpeg');
            $("#cropperImage").val(this.authUser.picture);
            $('.cropPopup').css("opacity", '0');
            setTimeout(function(){$('.imageCropperPopup').css("display", 'none');}, 500);

            $('.cropImageContainer').css("opacity", '1');
            $('.cropImageContainer').css("display", 'block');
        },
        createImage(file) {
            this.authUser.picture = new Image();
            var reader = new FileReader();

            reader.onload = (e) => {
                this.authUser.picture = e.target.result;
            };

            console.log(this.authUser.picture);
            reader.readAsDataURL(file);
        },
        removeImage: function (e) {
            this.authUser.picture = '';
        },
        verifRegistration: function () {
            // console.log(this.authUser);
            this.confirmMsg = {};
            this.$http.post("/jslim/verifRegistration", this.authUser).then((response) => {
                console.log(response);
                if (response.ok == true) {
                    this.formErrors = false;
                    this.confirmMsg['error'] = false;
                    // this.confirmMsg['success'] = response.data;
                    // GO to the Next screen
                    this.simpleUser = false;
                    $('.submit-group').css('display', 'block').removeClass('fadeOutDown').addClass('fadeInUp animated');
                    VueScrollTo.scrollTo("#app");
                }

            }, (response) => {
                console.log(response);
                if (response.ok == false) {
                    this.confirmMsg['success'] = false;
                    this.formErrors = response.data;
                    this.simpleUser = true;
                    this.confirmMsg['error'] = "Veuillez vérifier vos informations";
                    VueScrollTo.scrollTo("#app");
                }
            });
            setTimeout(function () {
                this.confirmMsg = {};
            }, 2000);

        },
        showPopup: function ($specialistEmail, $specialistName, $specialistRoot) {
            // console.log($specialistEmail);
            // console.log($specialistName);
            this.popupsView = true;
            this.specialist.url = "/jslim/deconnectToSpecialit/" + $specialistRoot + "/" + $specialistEmail;
            this.specialist.name = $specialistName;
        },
        // getSousPrograms: function (e) {
        //     this.sousPrograms[0].label ="testlabel";
        //     this.sousPrograms[0].id ="4";
        //     this.sousPrograms.push({
        //         'label' : 'testlabel2',
        //         'id': '5',
        //     });
        //
        // }

        invitCoach: function () {
            var invitList = $("#coachInvit").tagsinput('items');
            this.confirmMsg = {};

            $("#toputresult > div").remove();

            this.$http.post("/jslim/invitCoach", invitList).then((response) => {
                console.log(response);
                if (response.ok == true) {
                    this.formErrors = false;
                    this.confirmMsg['error'] = false;
                    // this.confirmMsg['success'] = response.data;
                    $("#toputresult").show('500').append(response.data);
                    // GO to the Next screen
                    VueScrollTo.scrollTo("#app");

                    $(".closemail").click(function (event) {
                       $( event.target ).parent().hide('500').remove();
                       setTimeout(function(){
                           $( event.target ).parent().remove();
                       },550);
                       // $( event.target ).closest( "div.alert" ).hide();
                   });
                }

            }, (response) => {
                console.log(response);
                if (response.ok == false) {
                    this.confirmMsg['success'] = false;
                    this.formErrors = response.data;
                    this.confirmMsg['error'] = "Une erreur serveur est produite, veuillez réessayer plus tard";
                    VueScrollTo.scrollTo("#app");
                }
            });
            setTimeout(function () {
                this.confirmMsg = {};
            }, 2000);
        },
        acceptSalleInvit: function ($id, $invitToken) {
            alert($invitToken);
            this.confirmMsg = {};
            this.$http.get("/jslim/acceptSalleInvit/"+$id+"/"+$invitToken).then((response) => {
                console.log(response);
                if (response.ok == true) {
                    this.formErrors = false;
                    this.confirmMsg['error'] = false;
                    this.confirmMsg['success'] = response.data;
                    // GO to the Next screen
                    VueScrollTo.scrollTo("#app");
                    $("#accept_inv").css("display","none");
                    $("#isCoach").css("display","block");
                }

            }, (response) => {
                console.log(response);
                if (response.ok == false) {
                    this.confirmMsg['success'] = false;
                    this.formErrors = response.data;
                    this.confirmMsg['error'] = response.data;
                    VueScrollTo.scrollTo("#app");
                }
            });
            setTimeout(function () {
                this.confirmMsg = {};
            }, 2000);

            // TODO : Check pk les msg de confiration ne s'affiches pas
        },
        cancelSalleInvit: function ($id) {
            this.confirmMsg = {};
            this.$http.get("/jslim/cancelSalleInvit/"+$id).then((response) => {
                console.log(response);
                if (response.ok == true) {
                    this.formErrors = false;
                    this.confirmMsg['error'] = false;
                    this.confirmMsg['success'] = response.data;
                    // GO to the Next screen
                    VueScrollTo.scrollTo("#app");
                    $("#accept_inv").css("display","none");
                }

            }, (response) => {
                console.log(response);
                if (response.ok == false) {
                    this.confirmMsg['success'] = false;
                    this.formErrors = response.data;
                    this.confirmMsg['error'] = response.data;
                    VueScrollTo.scrollTo("#app");
                }
            });
            setTimeout(function () {
                this.confirmMsg = {};
            }, 2000);
        },
        initSalleInvit: function () {

            this.authUser.account = 2;
            this.authUser.societe = $('#societe').val();
            this.authUser.email = $('#email').val();
        },
        editPlunning: function ($id) {
            $("#summernote-"+$id).summernote({focus:!0,toolbar:[["style",["style"]],["font",["bold","italic","underline","clear"]],["fontname",["fontname"]],["fontsize",["fontsize"]],["color",["color"]],["para",["ul","ol","paragraph"]],["height",["height"]],["table",["table"]],["insert",["link","picture","hr"]],["view",["fullscreen"]]]});
        },
        /**
         *
         * @param $id
         * @param $day
         * @param $time
         */
        savePlunning: function ($id, $day, $time) {
            var food = $('#summernote-'+$id).summernote('code');
            this.dayFood = this.authUser.food_plunning[$day];
            if(this.dayFood == undefined){
                this.dayFood = {};
            }
            console.log(this.dayFood);
            console.log($day);
            console.log($time);

            this.$set(this.dayFood, $time, food);
            console.log(this.dayFood);

            this.authUser.food_plunning[$day] = this.dayFood;
            $("#summernote-"+$id).summernote("code");$("#summernote-"+$id).summernote("destroy");
        },
        /*---------------------------------------
         * TOGGLE PLUNNING TABLES
         ----------------------------------------*/
        togglePlunnings : function () {
            var id = this.plunningShow;

            if((id == null) || (id == "null")){
                $(".specialistPlunning").css('opacity', '0');
                setTimeout(function(){
                    $(".specialistPlunning").css('display', 'none');
                    $("#personnalPlunning").css({
                        "opacity": "1",
                        "display": "block"
                    });
                }, 500);

            }else{
                $("#personnalPlunning, .specialistPlunning").css('opacity', '0');
                setTimeout(function(){
                    $("#personnalPlunning, .specialistPlunning").css('display', 'none');

                    $("#specialistPlunning" + id).css({
                        "opacity": "1",
                        "display": "block"
                    });
                }, 500);


            }
        },
        /*---------------------------------------
         * Private / Public informations
         ----------------------------------------*/
        publish : function ($field) {
            // console.log(this.authUser);
            $(".more_options #options.collapse").removeClass('in');
            $(".more_options .btn.btn-s").removeClass('active');
            this.confirmMsg = {};
            this.$http.get("/jslim/publish/"+$field).then((response) => {
                console.log(response);
                if (response.ok == true) {
                    this.formErrors = false;
                    this.confirmMsg['error'] = false;
                    // this.confirmMsg['success'] = response.data;
                    // GO to the Next screen
                    $('.'+$field+'btn > i:nth-child(1)').attr('class', 'icon-earth');
                    // VueScrollTo.scrollTo("#app");
                }

            }, (response) => {
                console.log(response);
                if (response.ok == false) {
                    this.confirmMsg['success'] = false;
                    this.formErrors = response.data;
                    this.confirmMsg['error'] = "Veuillez réessayé plus tard";
                    VueScrollTo.scrollTo("#app");
                }
            });
            setTimeout(function () {
                this.confirmMsg = {};
            }, 2000);
        },
        unpublish : function ($field) {
            // console.log(this.authUser);
            $(".more_options #options.collapse").removeClass('in');
            $(".more_options .btn.btn-s").removeClass('active');
            this.confirmMsg = {};
            this.$http.get("/jslim/unpublish/"+$field).then((response) => {
                console.log(response);
                if (response.ok == true) {
                    this.formErrors = false;
                    this.confirmMsg['error'] = false;
                    // this.confirmMsg['success'] = response.data;
                    // GO to the Next screen
                    $('.'+$field+'btn > i:nth-child(1)').attr('class', 'icon-lock2');
                    // VueScrollTo.scrollTo("#app");
                }

            }, (response) => {
                console.log(response);
                if (response.ok == false) {
                    this.confirmMsg['success'] = false;
                    this.formErrors = response.data;
                    this.confirmMsg['error'] = "Veuillez réessayé plus tard";
                    VueScrollTo.scrollTo("#app");
                }
            });
            setTimeout(function () {
                this.confirmMsg = {};
            }, 2000);
        },
        /*---------------------------------------
         * PAYPAL FORM
         ----------------------------------------*/
        paypalForm : function ($amount, $offreId, $payFor) {


            this.confirmMsg = {};
            this.$http.get("/jslim/getClientToken/"+$offreId+"/"+$payFor).then((response) => {
                console.log(response);
                if (response.ok == true) {
                    this.formErrors = false;
                    this.confirmMsg['error'] = false;
                    // GO to the Next screen

                    var submitButton = document.querySelector('#submit-button');
                    dropin.create({
                        // authorization: 'sandbox_fj8qxk4k_y5rb6hpmn8w4mdbs',
                        authorization: response.data,
                        selector: '#dropin-container',
                        locale: 'fr_FR',
                        paypal: {
                            flow: 'vault',
                            amount: $amount,
                            currency: 'EUR',
                            intent: 'sale',
                            locale :'fr_FR'
                        }
                    }, function (err, dropinInstance) {
                        if (err) {
                            // Handle any errors that might've occurred when creating Drop-in
                            console.error(err);
                            return;
                        }
                        var form = document.getElementById('sendDeviceForm');
                        var deviceDataInput = form['device_data'];
                        var nonceInput = form['payment_method_nonce'];
                        var amountInput = form['payment_amount'];

                        var payedFor = document.createElement('input');
                            payedFor.name = $payFor;
                            payedFor.type = 'hidden';
                            payedFor.value = $offreId;
                            form.appendChild(payedFor);

                        if (deviceDataInput == null) {
                            deviceDataInput = document.createElement('input');
                            deviceDataInput.name = 'device_data';
                            deviceDataInput.type = 'hidden';
                            form.appendChild(deviceDataInput);
                        }
                        if (nonceInput == null) {
                            nonceInput = document.createElement('input');
                            nonceInput.name = 'payment_method_nonce';
                            nonceInput.type = 'hidden';
                            form.appendChild(nonceInput);
                        }
                        if (amountInput == null) {
                            amountInput = document.createElement('input');
                            amountInput.name = 'payment_amount';
                            amountInput.type = 'hidden';
                            form.appendChild(amountInput);
                        }

                        submitButton.addEventListener('click', function () {
                            dropinInstance.requestPaymentMethod(function (err, payload) {
                                console.log(payload);
                                if (err) {
                                    console.error(err);
                                    // Handle errors in requesting payment method
                                }

                                // Send payload.nonce to your server

                                deviceDataInput.value = payload.deviceData;
                                nonceInput.value = payload.nonce;
                                amountInput.value = $amount;
                                form.submit();
                                // END OF Sending payload.nonce to your server
                            });
                        });
                    });

                }

            }, (response) => {
                console.log(response);
                if (response.ok == false) {
                    this.confirmMsg['success'] = false;
                    this.formErrors = response.data;
                    this.confirmMsg['error'] = response.data;
                    VueScrollTo.scrollTo("#app");
                }
            });
            setTimeout(function () {
                this.confirmMsg = {};
            }, 2000);
        },
        sendNounce : function (payload) {
            // this.confirmMsg = {};
            this.$http.post("/jslim/checkout", payload).then((response) => {
                console.log(response);
                if (response.ok == true) {
                    this.formErrors = false;
                    this.confirmMsg['error'] = false;
                    // GO to the Next screen
                    console.log(response.data);
                }

            }, (response) => {
                console.log(response);
                if (response.ok == false) {
                    this.confirmMsg['success'] = false;
                    this.formErrors = response.data;
                    this.confirmMsg['error'] = "Erreur Serveur !";
                    VueScrollTo.scrollTo("#app");
                }
            });
            setTimeout(function () {
                this.confirmMsg = {};
            }, 2000);
        },
        selectOffer : function (id) {
            $(".pricing .price-box").removeClass("popular");
            $(".pricing .price-box .btn").removeClass("btn-select-plan").addClass("btn-default");

            $("#offre"+id+" > .price-box").addClass("popular");
            $("#offre"+id+" > .price-box .btn").removeClass("btn-default").addClass("btn-select-plan");
            // btn-sm
            $("#selectOffer").val(id);
            this.authUser.selectOffer = id;

        },
        verifOfferSelect : function () {
            // var id = $("#selectOffer").val();
            // var router = new VueRouter();
            // router.push({ mode: 'abstract', path: '/jslim/payement/'+this.authUser.selectOffer});
            this.confirmMsg = {};
            this.$http.post("/jslim/verifOfferSelect", this.authUser).then((response) => {
                console.log(response);

                if (response.ok == true) {

                    this.$http.post("/jslim/register", this.authUser).then((response) => {
                        //GOOD
                        if (response.ok == true) {
                            if((this.authUser.account == 2) || (this.authUser.account == 3)) {
                                // alert('/jslim/payement/'+this.authUser.selectOffer);
                                // router.go();
                                window.location.href = '/jslim/payement/'+this.authUser.selectOffer;
                            }else{
                                window.location.href = '/jslim/home';
                            }
                        }

                    }, (response) => {
                        if (response.ok == false) {
                            this.confirmMsg['success'] = false;
                            this.confirmMsg['error'] = "Veuillez vérifier vos informations";
                            this.formErrors = response.data;
                        }else{

                        }

                    });

                    /**/
                }
            }, (response) => {
                if (response.ok == false) {
                    this.confirmMsg['success'] = false;
                    this.confirmMsg['error'] = "Veuillez selectionner une Offre valide";
                    this.formErrors = response.data;
                }
            });

            setTimeout(function () {
                this.confirmMsg = {};
            }, 2000);
        },
        updatePaypalAcount: function () {
                this.$http.post("/jslim/updatePaypalAcount", this.authUser).then((response) => {
                    //GOOD
                    if (response.ok == true) {
                        this.formErrors = false;
                        this.confirmMsg['error'] = false;
                        this.confirmMsg['success'] = response.data;
                    }

                }, (response) => {
                    if (response.ok == false) {
                        this.confirmMsg['success'] = false;
                        this.confirmMsg['error'] = "Veuillez vérifier vos informations";
                        this.formErrors = response.data;
                    }

                });
                setTimeout(function () {
                    this.confirmMsg = {}
                }, 2000);
            VueScrollTo.scrollTo("#app");
        },
        calculeIMC : function () {
            this.authUser.imc = this.authUser.poid / Math.pow((this.authUser.taille / 100), 2);
        },
        calculeObjectifIMC : function () {
            this.authUser.objectifImc = this.authUser.objectif / Math.pow((this.authUser.taille / 100), 2);
        },

    }
});
