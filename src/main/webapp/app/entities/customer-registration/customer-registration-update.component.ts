import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT, DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { ICustomerRegistration, CustomerRegistration } from 'app/shared/model/customer-registration.model';
import { CustomerRegistrationService } from './customer-registration.service';
import { ShutterService } from '../shutter/shutter.service';
import { IShutter, Shutter } from '../../shared/model/shutter.model';
import { AdBsDatesService } from '../ad-bs-dates/ad-bs-dates.service';
import { AdBsDates, IAdBsDates } from '../../shared/model/ad-bs-dates.model';
import { CustomerService } from '../customer/customer.service';
import { ElectricityTypeService } from '../electricity-type/electricity-type.service';
import { Customer, ICustomer } from '../../shared/model/customer.model';
import { ElectricityType, IElectricityType } from '../../shared/model/electricity-type.model';
import { IItem, Item } from '../../shared/model/item.model';
import { ICustomerShutter } from '../../shared/model/customer-shutter.model';
import { IBusinessType } from '../../shared/model/business-type.model';
import { BusinessTypeService } from '../business-type/business-type.service';
import { IServiceCharge, ServiceCharge } from '../../shared/model/service-charge.model';
import { ServiceChargeService } from '../service-charge/service-charge.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DiscountPolicy, IDiscountPolicy } from '../../shared/model/discount-policy.model';
import { DiscountPolicyService } from '../discount-policy/discount-policy.service';
import { IFloor } from '../../shared/model/floor.model';
import { FloorService } from '../floor/floor.service';
import { ItemService } from '../item/item.service';
type SelectableEntity =
  | IDiscountPolicy
  | IShutter
  | IServiceCharge
  | ICustomerRegistration
  | ICustomer
  | IElectricityType
  | IItem
  | IBusinessType
  | IFloor;

@Component({
  selector: 'jhi-customer-registration-update',
  templateUrl: './customer-registration-update.component.html',
  styleUrls: ['customer-registration.scss'],
})
export class CustomerRegistrationUpdateComponent implements OnInit {
  isSaving = false;
  showItem = true;
  item: IItem | any = new Item();
  customer: ICustomer | any = new Customer();
  electrictyType: IElectricityType | any = new ElectricityType();
  serviceCharge: IServiceCharge | any = new ServiceCharge();
  showValue = true;
  isAnonymous = true;
  isDisabled = true;
  shutterList: IShutter[] = [];
  businessTypeList: IBusinessType[] = [];
  floors: IFloor[] = [];
  discountPolicy: IDiscountPolicy | any = new DiscountPolicy();
  shutter: IShutter | any = new Shutter();
  shutters: IShutter[] = [];
  policies: IDiscountPolicy[] = [];
  policiesList: IDiscountPolicy[] = [];
  shutterId: any;
  totalShutters: IShutter[] = [];
  totalPolicies: IDiscountPolicy[] = [];
  adBsDate: IAdBsDates | null = new AdBsDates();
  customerRegistrationObj: ICustomerRegistration | any = new CustomerRegistration();
  customerRegistraion: ICustomerRegistration | any = new CustomerRegistration();
  showShutter = false;
  showElectricity = false;
  showPolicy = false;
  customerList: ICustomer[] = [];
  serviceChargeList: IServiceCharge[] = [];
  itemList: IItem[] = [];
  electricityList: IElectricityType[] = [];
  fiscalYrStart?: string;
  fiscalYrEnd?: string;
  showPopup = false;
  closeResult?: string;
  message?: string;
  editForm = this.fb.group({
    id: [],
    applicationNumber: [null, [Validators.required]],
    registrationNumber: [null, [Validators.required]],
    applicationDate: [null, [Validators.required]],
    registrationDate: [null, [Validators.required]],
    totalArea: [null],
    monthlyRate: [null],
    monthlyRent: [null],
    customerType: [null],
    electricityRate: [],
    shopName: [null, [Validators.required]],
    businessTypeId: [null, [Validators.required]],
    businessTypeName: [],
    electricityTypeId: [null],
    electricityTypeName: [],
    serviceChargeId: [null, [Validators.required]],
    serviceChargeName: [],
    serviceChargeRate: [],
    advanceAmount: [null],
    depositAmount: [],
    paymentType: [null],
    advancementTillDate: [null, [Validators.required]],
    currentUnit: [null, [Validators.required]],
    rate: [null, [Validators.required]],
    electricityMeterNumber: [null],
    electricityMeterType: [null],
    itemMeterNumber: [],
    bankNumber: [],
    chequeNumber: [],
    itemId: [null, [Validators.required]],
    itemRateName: [],
    // enteredById: [],
    enteredByLogin: [],
    // approvedById: [],
    approvedByLogin: [],
    customerId: [],
    customerN: [],
    // enteredDate: [],
    // approvedDate: [],
    customerShutters: this.fb.array([]),
    discountPolicies: this.fb.array([]),
    createdDate: [],
    updatedDate: [],
    deleted: [],
    insertedBy: [],
    insertedById: [],
    updatedBy: [],
    updatedById: [],
    status: [],
    floorId: [],
    showShutter: [],
    showElectricity: [],
    showPolicy: [],
    meterType: [],
    electricityFromUnit: [],
    electricityToUnit: [],
    rentOpeningBalance: [],
    electricityOpeningBalance: [],
    serviceOpeningBalance: [],
  });

  constructor(
    protected customerRegistrationService: CustomerRegistrationService,
    protected serviceChargeService: ServiceChargeService,
    protected customerService: CustomerService,
    protected businessTypeService: BusinessTypeService,
    protected electricityTypeService: ElectricityTypeService,
    protected adBsDatesService: AdBsDatesService,
    protected shutterService: ShutterService,
    protected activatedRoute: ActivatedRoute,
    protected itemService: ItemService,
    protected discountPolicyService: DiscountPolicyService,
    private fb: FormBuilder,
    protected modalService: NgbModal,
    protected floorService: FloorService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ customerRegistration }) => {
      this.itemService.query().subscribe((res: HttpResponse<IItem[]>) => {
        this.itemList = res.body || [];
      });
      if (!customerRegistration.id) {
        const today = moment().startOf('day');
        customerRegistration.advancementTillDate = today;
        customerRegistration.enteredDate = today;
        customerRegistration.approvedDate = today;
        customerRegistration.createdDate = today;
        customerRegistration.updatedDate = today;
        this.addNewCustomerShutter();
        this.addNewDiscountPolicies();
        const customer = this.parse(customerRegistration);
        if (!customerRegistration.id) {
          this.editForm.get(['showShutter'])?.setValue(true);
        } else if (customerRegistration.id && customerRegistration.floorId) {
          this.editForm.get(['showShutter'])?.setValue(false);
        } else {
          this.editForm.get(['showShutter'])?.setValue(true);
        }
        if (!customerRegistration.id) {
          this.editForm.get(['showElectricity'])?.setValue(true);
        } else if (customerRegistration.id && customerRegistration.floorId) {
          this.editForm.get(['showElectricity'])?.setValue(false);
        } else {
          this.editForm.get(['showElectricity'])?.setValue(true);
        }
        /* if (!customerRegistration.id) {
          this.editForm.get(['showPolicy'])?.setValue(true);
        } else if (customerRegistration.id && customerRegistration.floorId) {
          this.editForm.get(['showPolicy'])?.setValue(false);
        } else {
          this.editForm.get(['showPolicy'])?.setValue(true);
        }*/
        this.adBsDatesService.findByAdDate(customer.createdDate).subscribe((res: HttpResponse<IAdBsDates>) => {
          this.adBsDate = res.body;
          if (this.adBsDate) {
            /*this.customerShutters.at(0).get('effectiveDateFrom')?.setValue(customerRegistration.fiscalBsStart);
            this.customerShutters.at(0).get('effectiveDateTo')?.setValue(customerRegistration.fiscalBsEnd);
            */ this.editForm
              .get('applicationDate')
              ?.setValue(this.adBsDate.bsDate);
            this.editForm.get('registrationDate')?.setValue(this.adBsDate.bsDate);
            this.fiscalYrStart = customerRegistration.fiscalBsStart;
            this.fiscalYrEnd = customerRegistration.fiscalBsEnd;
          }
        });
        this.customerRegistrationService.getLatestRegistrationNumber().subscribe((res: HttpResponse<ICustomerRegistration>) => {
          this.customerRegistraion = res.body;
          this.editForm.get(['registrationNumber'])?.setValue(this.customerRegistraion?.registrationNumber);
        });
        this.customerRegistrationService.getLatestApplicationNumber().subscribe((res: HttpResponse<ICustomerRegistration>) => {
          this.customerRegistraion = res.body;
          this.editForm.get(['applicationNumber'])?.setValue(this.customerRegistraion?.registrationNumber);
        });
      }
      this.customerService.finadAll().subscribe((res: HttpResponse<ICustomer[]>) => {
        this.customerList = res.body || [];
      });

      this.floorService.query().subscribe((res: HttpResponse<IFloor[]>) => {
        this.floors = res.body || [];
      });

      this.businessTypeService.query().subscribe((res: HttpResponse<IBusinessType[]>) => {
        this.businessTypeList = res.body || [];
      });

      this.shutterService.getListOfExpiredShutters().subscribe((res: HttpResponse<IShutter[]>) => {
        this.shutterList = res.body || [];
      });

      if (customerRegistration.id) {
        if (customerRegistration.customerShutters.length > 0) {
          customerRegistration.showShutter = true;
        }
        if (customerRegistration.electricityTypeId) {
          customerRegistration.showElectricity = true;
        }

        // this.itemRateService.findByBusinessTypeId(customerRegistration.businessTypeId).subscribe((res: HttpResponse<IItemRate[]>) => {
        //   this.itemList = res.body || [];
        // });

        this.discountPolicyService
          .findByBusinessTypeIdAndRegistrationNumber(customerRegistration.businessTypeId, customerRegistration.registrationNumber)
          .subscribe((res: HttpResponse<IDiscountPolicy[]>) => {
            this.policiesList = res.body || [];
            this.isAnonymous = false;
          });

        this.electricityTypeService
          .findByBusinessTypeId(customerRegistration.businessTypeId)
          .subscribe((res: HttpResponse<IElectricityType[]>) => {
            this.electricityList = res.body || [];
          });

        this.serviceChargeService
          .findByBusinessTypeId(customerRegistration.businessTypeId)
          .subscribe((res: HttpResponse<IServiceCharge[]>) => {
            this.serviceChargeList = res.body || [];
          });

        for (let index = 0; index <= customerRegistration.customerShutters.length - 1; index++) {
          this.shutterService.find(customerRegistration.customerShutters[index].shutterId).subscribe((res: HttpResponse<IShutter>) => {
            this.shutter = res.body;
            this.shutters.push(this.shutter);
          });
        }
        for (let index = 0; index <= customerRegistration.discountPolicies.length - 1; index++) {
          this.discountPolicyService
            .find(customerRegistration.discountPolicies[index].id)
            .subscribe((res: HttpResponse<IDiscountPolicy>) => {
              this.discountPolicy = res.body;
              this.policies.push(this.discountPolicy);
            });
        }
        this.editForm.setControl('discountPolicies', this.setExistingDiscountPolicies(customerRegistration.discountPolicies));
        this.editForm.setControl('customerShutters', this.setExistingCustomerShutter(customerRegistration.customerShutters));
      }
      this.updateForm(customerRegistration);
    });
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }

  updateForm(customerRegistration: ICustomerRegistration): void {
    this.editForm.patchValue({
      id: customerRegistration.id,
      applicationNumber: customerRegistration.applicationNumber,
      registrationNumber: customerRegistration.registrationNumber,
      applicationDate: customerRegistration.applicationDate,
      registrationDate: customerRegistration.registrationDate,
      totalArea: customerRegistration.totalArea,
      monthlyRate: customerRegistration.monthlyRate,
      customerType: customerRegistration.customerType,
      shopName: customerRegistration.shopName,
      electricityTypeId: customerRegistration.electricityTypeId,
      electricityTypeName: customerRegistration.electricityTypeName,
      advanceAmount: customerRegistration.advanceAmount,
      depositAmount: customerRegistration.depositAmount,
      paymentType: customerRegistration.paymentType,
      advancementTillDate: customerRegistration.advancementTillDate
        ? customerRegistration.advancementTillDate.format(DATE_TIME_FORMAT)
        : null,
      currentUnit: customerRegistration.currentUnit,
      rate: customerRegistration.rate,
      electricityMeterNumber: customerRegistration.electricityMeterNumber,
      electricityMeterType: customerRegistration.electricityMeterType,
      itemMeterNumber: customerRegistration.itemMeterNumber,
      bankNumber: customerRegistration.bankNumber,
      chequeNumber: customerRegistration.chequeNumber,
      itemId: customerRegistration.itemId,
      itemRateName: customerRegistration.itemRateName,
      // enteredById: customerRegistration.enteredById,
      enteredByLogin: customerRegistration.enteredByLogin,
      // approvedById: customerRegistration.approvedById,
      approvedByLogin: customerRegistration.approvedByLogin,
      customerId: customerRegistration.customerId,
      customerN: customerRegistration.customerN,
      // enteredDate: customerRegistration.enteredDate ? customerRegistration.enteredDate.format(DATE_TIME_FORMAT) : null,
      // approvedDate: customerRegistration.approvedDate ? customerRegistration.approvedDate.format(DATE_TIME_FORMAT) : null,
      businessTypeId: customerRegistration.businessTypeId,
      businessTypeName: customerRegistration.businessTypeName,
      serviceChargeId: customerRegistration.serviceChargeId,
      serviceChargeName: customerRegistration.serviceChargeName,
      serviceChargeRate: customerRegistration.serviceChargeRate,
      customerShutters: customerRegistration.customerShutters,
      discountPolicies: customerRegistration.discountPolicies,
      createdDate: customerRegistration.createdDate ? customerRegistration.createdDate.format(DATE_TIME_FORMAT) : null,
      updatedDate: customerRegistration.updatedDate ? customerRegistration.updatedDate.format(DATE_TIME_FORMAT) : null,
      deleted: customerRegistration.deleted,
      insertedBy: customerRegistration.insertedBy,
      insertedById: customerRegistration.insertedById,
      updatedBy: customerRegistration.updatedBy,
      updatedById: customerRegistration.updatedById,
      status: customerRegistration.status,
      monthlyRent: customerRegistration.monthlyRent,
      floorId: customerRegistration.floorId,
      showShutter: customerRegistration.showShutter,
      showElectricity: customerRegistration.showElectricity,
      electricityFromUnit: customerRegistration.electricityFromUnit,
      electricityToUnit: customerRegistration.electricityToUnit,
      electricityRate: customerRegistration.electricityRate,
      enteredById: customerRegistration.enteredById,
      approvedById: customerRegistration.approvedById,
      rentOpeningBalance: customerRegistration.rentOpeningBalance,
      electricityOpeningBalance: customerRegistration.electricityOpeningBalance,
      serviceOpeningBalance: customerRegistration.serviceOpeningBalance,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const customerRegistration = this.createFromForm();
    const id = this.editForm.get(['id'])!.value;
    if (id) {
      this.subscribeToSaveResponse(this.customerRegistrationService.update(customerRegistration));
    } else {
      this.subscribeToSaveResponse(this.customerRegistrationService.create(customerRegistration));
      this.modalService.dismissAll();
    }
  }

  setServiceChargeRate(): void {
    this.serviceChargeService.find(this.editForm.get(['serviceChargeId'])!.value).subscribe((res: HttpResponse<IServiceCharge>) => {
      this.serviceCharge = res.body;
      this.editForm.get(['serviceChargeRate'])?.setValue(this.serviceCharge.rate);
    });
  }

  get customerShutters(): FormArray {
    return this.editForm.get('customerShutters') as FormArray;
  }

  get discountPolicies(): FormArray {
    return this.editForm.get('discountPolicies') as FormArray;
  }

  newCustomerShutters(): FormGroup {
    if (this.customerShutters.getRawValue().length > 0) {
      return this.fb.group({
        id: '',
        status: true,
        effectiveDateFrom: this.customerShutters.at(0).get(['effectiveDateFrom'])?.value,
        effectiveDateTo: this.customerShutters.at(0).get(['effectiveDateTo'])?.value,
        customerId: '',
        shutterId: '',
        shutterNo: '',
        customerRegistrationId: '',
      });
    }
    return this.fb.group({
      id: '',
      status: true,
      effectiveDateFrom: '',
      effectiveDateTo: '',
      customerId: '',
      shutterId: '',
      shutterNo: '',
      customerRegistrationId: '',
    });
  }

  newDiscountPolicies(): FormGroup {
    return this.fb.group({
      id: '',
      name: '',
      numberOfDays: 0,
      discount: 0,
      policyType: '',
      discountType: '',
    });
  }

  setDiscountPolicy(discountPolicy: IDiscountPolicy): FormGroup {
    return this.fb.group({
      id: discountPolicy.id,
      name: discountPolicy.name,
      numberOfDays: discountPolicy.numberOfDays,
      discount: discountPolicy.discount,
      policyType: discountPolicy.policyType,
      discountType: discountPolicy.discountType,
    });
  }

  setExistingDiscountPolicies(discountPolicies: IDiscountPolicy[]): FormArray {
    const formArray = new FormArray([]);
    discountPolicies.forEach(p => {
      formArray.push(this.setDiscountPolicy(p));
    });
    return formArray;
  }

  addNewCustomerShutter(): void {
    this.customerShutters.push(this.newCustomerShutters());
  }

  addNewDiscountPolicies(): void {
    this.discountPolicies.push(this.newDiscountPolicies());
  }

  setExistingCustomerShutter(customerShutter: ICustomerShutter[]): FormArray {
    const formArray = new FormArray([]);
    customerShutter.forEach(p => {
      formArray.push(this.setCustomerShutter(p));
    });
    return formArray;
  }

  setCustomerShutter(customerShutter: ICustomerShutter): FormGroup {
    return this.fb.group({
      id: customerShutter.id,
      status: true,
      effectiveDateFrom: customerShutter.effectiveDateFrom,
      effectiveDateTo: customerShutter.effectiveDateTo,
      customerId: customerShutter.customerId,
      shutterId: customerShutter.shutterId,
      shutterNo: customerShutter.shutterN,
      insertedById: customerShutter.insertedById,
      updatedById: customerShutter.updatedById,
      customerRegistrationId: customerShutter.customerRegistrationId,
    });
  }

  getListOfCustomer(): void {
    this.findByCustomerId();
    this.customerRegistrationService
      .findByCustomerId(this.editForm.get(['customerId'])!.value)
      .subscribe((res: HttpResponse<ICustomerRegistration>) => {
        this.customerRegistrationObj = res.body;
        if (this.customerRegistrationObj) {
          this.showPopup = true;
        }
      });
  }

  findByItemId(): void {
    this.itemService.find(this.editForm.get(['itemId'])!.value).subscribe((res: HttpResponse<IItem>) => {
      this.item = res.body;
      this.editForm.get('rate')?.setValue(this.item.rate);
      this.editForm.get('currentUnit')?.setValue(this.item.unit);
    });
  }

  resetCustomer(): void {
    this.modalService.dismissAll();
  }

  openPopup(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'bill-proceed-title' }).result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  removeDiscountPolicies(i: number): void {
    this.showPolicy = false;
    this.policiesList.forEach((policy, index) => {
      if (policy.name === undefined || policy.name === '') {
        this.policiesList.splice(i, index);
      }
    });
    const policyId = this.discountPolicies.at(i).get('id')!.value;
    if (policyId) {
      this.discountPolicyService.find(policyId).subscribe((res: HttpResponse<IDiscountPolicy>) => {
        this.discountPolicy = res.body;
        this.policiesList.push(this.discountPolicy);
      });
    }
    this.discountPolicies.removeAt(i);
  }

  removeCustomerShutter(i: number): void {
    this.shutterList.forEach((shutter, index) => {
      if (shutter.shutterNo === '' || shutter.shutterNo === undefined) {
        this.shutterList.splice(index, 1);
      }
    });
    const shutterId = this.customerShutters.at(i).get('shutterId')!.value;
    if (shutterId) {
      this.shutterService.find(shutterId).subscribe((res: HttpResponse<IShutter>) => {
        this.shutter = res.body;
        this.editForm.get('totalArea')?.setValue(this.editForm.get('totalArea')!.value - this.shutter.area);
        this.editForm.get('monthlyRate')?.setValue(this.editForm.get('monthlyRate')!.value - this.shutter.rate);
        this.shutterList.push(this.shutter);
      });
      this.showShutter = false;
    }
    this.customerShutters.removeAt(i);
  }
  formatEffectiveDateFrom(event?: any, i?: any): void {
    const tempStart = this.customerShutters.at(i).get('effectiveDateFrom')!.value;
    const length = tempStart.length;
    let finalEffectiveDateFrom;
    if (length <= 4) {
      this.customerShutters
        .at(i)
        .get(['effectiveDateFrom'])
        ?.setValue(this.fiscalYrStart + '-');
    } else {
      if (event.key !== 'Backspace') {
        if (length === 7) {
          finalEffectiveDateFrom = tempStart + '-';
          this.customerShutters.at(i).get(['effectiveDateFrom'])?.setValue(finalEffectiveDateFrom);
        }
      }
    }
    for (let index = 1; index <= this.customerShutters.length - 1; index++) {
      if (event.key !== 'Backspace') {
        this.customerShutters.at(index).get(['effectiveDateFrom'])?.setValue(this.customerShutters.at(0).get('effectiveDateFrom')!.value);
      }
    }
  }

  formatEffectiveDateTo(event?: any, i?: any): void {
    const tempStart = this.customerShutters.at(i).get('effectiveDateTo')!.value;
    const length = tempStart.length;
    let finalEffectiveDateTo;
    if (length <= 4) {
      this.customerShutters
        .at(i)
        .get(['effectiveDateTo'])
        ?.setValue(this.fiscalYrEnd + '-');
    } else {
      if (event.key !== 'Backspace') {
        if (length === 7) {
          finalEffectiveDateTo = tempStart + '-';
          this.customerShutters.at(i).get(['effectiveDateTo'])?.setValue(finalEffectiveDateTo);
        }
      }
    }
    for (let index = 1; index <= this.customerShutters.length - 1; index++) {
      if (event.key !== 'Backspace') {
        this.customerShutters.at(index).get(['effectiveDateTo'])?.setValue(this.customerShutters.at(0).get('effectiveDateTo')!.value);
      }
    }
  }

  findByCustomerId(): void {
    this.customerService.find(this.editForm.get('customerId')!.value).subscribe((res: HttpResponse<ICustomer>) => {
      this.customer = res.body;
      this.editForm.get(['shopName'])?.setValue(this.customer.name);
      this.editForm.get(['customerType'])?.setValue(this.customer.type);
      this.editForm.get(['rentOpeningBalance'])?.setValue(this.customer.rentOpeningBalance);
      this.editForm.get(['electricityOpeningBalance'])?.setValue(this.customer.electricityOpeningBalance);
      this.editForm.get(['serviceOpeningBalance'])?.setValue(this.customer.serviceOpeningBalance);
    });
  }

  findWithOutCurrentShutter(i: number): void {
    this.showShutter = true;
    const shutterId = this.customerShutters.at(i).get('shutterId')!.value;
    this.shutterService.find(shutterId).subscribe((res: HttpResponse<IShutter>) => {
      this.shutter = res.body;
      if (i > 0) {
        this.editForm.get('totalArea')?.setValue(this.shutter.area + this.editForm.get('totalArea')!.value);
        this.editForm.get('monthlyRate')?.setValue(this.shutter.rate + this.editForm.get('monthlyRate')!.value);
      } else if (this.shutter.area && this.shutter.rate) {
        this.editForm.get('totalArea')?.setValue(this.shutter.area);
        this.editForm.get('monthlyRate')?.setValue(this.shutter.rate);
      } else if (this.shutter.area && !this.shutter.rate) {
        this.editForm.get('totalArea')?.setValue(this.shutter.area);
        this.editForm.get('monthlyRate')?.setValue(this.shutter.area);
      } else {
        this.editForm.get('totalArea')?.setValue(this.shutter.rate);
        this.editForm.get('monthlyRate')?.setValue(this.shutter.rate);
      }
      this.editForm.get(['monthlyRent'])?.setValue(this.editForm.get('monthlyRate')!.value * this.editForm.get('totalArea')!.value);
      this.customerShutters.at(i).get('shutterNo')?.setValue(this.shutter.shutterNo);
      if (this.showShutter) {
        this.shutterList.forEach((shutter, index) => {
          if (shutter.id === shutterId) {
            this.shutterList.splice(index, 1);
          }
        });
        const id = this.editForm.get(['id'])!.value;
        this.shutterService.getListOfExpiredShutters().subscribe((resp: HttpResponse<IShutter[]>) => {
          this.totalShutters = resp.body || [];
        });
        if (id) {
          this.shutters.forEach(shutter => {
            this.totalShutters.push(shutter);
          });
        }
        this.shutterList.forEach(shutter => {
          this.totalShutters.forEach((tShutter, index) => {
            if (tShutter.shutterNo === shutter.shutterNo) {
              this.totalShutters.splice(index, 1);
            }
          });
        });
        this.customerShutters.getRawValue().forEach(shutter => {
          this.totalShutters.forEach((tShutter, index) => {
            if (tShutter.shutterNo === shutter.shutterNo) {
              this.totalShutters.splice(index, 1);
            }
          });
        });
        this.totalShutters.forEach(shutter => {
          this.shutterList.push(shutter);
        });
      }
    });
    this.shutterList.forEach((shutter, index) => {
      if (shutter.shutterNo === '' || shutter.shutterNo === undefined) {
        this.shutterList.splice(index, 1);
      }
    });
  }
  setDiscountPolicies(index: number): boolean {
    this.policiesList.forEach((policy, i) => {
      if (policy.name === undefined || policy.name === '') {
        this.policiesList.splice(i, 1);
      }
    });
    this.showPolicy = true;
    const discountPolicyId = this.discountPolicies.at(index).get('id')!.value;
    if (!discountPolicyId || discountPolicyId === '' || discountPolicyId === '' || discountPolicyId === null) {
      this.showPolicy = false;
      return false;
    }
    if (this.showPolicy) {
      this.discountPolicyService.find(discountPolicyId).subscribe((res: HttpResponse<IDiscountPolicy>) => {
        this.discountPolicy = res.body;
        this.discountPolicies.at(index).get('name')?.setValue(this.discountPolicy.name);
        this.discountPolicies.at(index).get('numberOfDays')?.setValue(this.discountPolicy.numberOfDays);
        this.discountPolicies.at(index).get('discount')?.setValue(this.discountPolicy.discount);
        this.discountPolicies.at(index).get('discountType')?.setValue(this.discountPolicy.discountType);
        this.discountPolicies.at(index).get('policyType')?.setValue(this.discountPolicy.policyType);
        this.isAnonymous = false;
        this.policiesList.forEach((policy, i) => {
          if (policy.id === discountPolicyId) {
            this.policiesList.splice(i, 1);
          }
        });
        const id = this.editForm.get(['id'])!.value;
        if (id) {
          this.policies.forEach(policy => {
            this.totalPolicies.push(policy);
          });
        }
        this.discountPolicyService
          .findByBusinessTypeIdAndRegistrationNumber(
            this.editForm.get(['businessTypeId'])!.value,
            this.editForm.get(['registrationNumber'])!.value
          )
          .subscribe((resp: HttpResponse<IDiscountPolicy[]>) => {
            this.totalPolicies = resp.body || [];
          });
        this.policiesList.forEach(policy => {
          this.totalPolicies.forEach((tPolicy, i) => {
            if (tPolicy.id === policy.id) {
              this.totalPolicies.splice(i, 1);
            }
          });
        });

        this.discountPolicies.getRawValue().forEach(policy => {
          this.totalPolicies.forEach((tPolicy, i) => {
            if (tPolicy.id === policy.id) {
              this.totalPolicies.splice(i, 1);
            }
          });
        });
        this.totalPolicies.forEach(policy => {
          this.policiesList.push(policy);
        });
      });

      return true;
    }
    return true;
  }

  // checkItemRateType(): void {
  //   this.itemRateService.find(this.editForm.get(['itemRateId'])!.value).subscribe((res: HttpResponse<IItemRate>) => {
  //     this.item = res.body;
  //     this.findByItemRateId();
  //     if (this.item.rateType === 'FIXED_RATE') {
  //       this.showItem = false;
  //     } else {
  //       this.showItem = true;
  //     }
  //   });
  // }
  findByElectricityTypeId(): void {
    this.electricityTypeService.find(this.editForm.get(['electricityTypeId'])!.value).subscribe((res: HttpResponse<IElectricityType>) => {
      this.electrictyType = res.body;
      this.editForm.get(['electricityMeterNumber'])?.setValue(this.electrictyType.meterNumber);
      this.editForm.get(['electricityRate'])?.setValue(this.electrictyType.rate);
    });
  }

  findByBusinessId(): void {
    // this.itemRateService.query().subscribe((res: HttpResponse<IItemRate[]>) => {
    //   this.itemList = res.body || [];
    //   this.isAnonymous = false;
    // });
    this.electricityTypeService
      .findByBusinessTypeId(this.editForm.get(['businessTypeId'])!.value)
      .subscribe((res: HttpResponse<IElectricityType[]>) => {
        this.electricityList = res.body || [];
        this.isAnonymous = false;
      });
    this.serviceChargeService
      .findByBusinessTypeId(this.editForm.get(['businessTypeId'])!.value)
      .subscribe((res: HttpResponse<IServiceCharge[]>) => {
        this.serviceChargeList = res.body || [];
        this.isAnonymous = false;
      });

    this.discountPolicyService
      .findByBusinessTypeIdAndRegistrationNumber(
        this.editForm.get(['businessTypeId'])!.value,
        this.editForm.get(['registrationNumber'])!.value
      )
      .subscribe((res: HttpResponse<IDiscountPolicy[]>) => {
        this.policiesList = res.body || [];
        this.isAnonymous = false;
      });
  }

  private createFromForm(): ICustomerRegistration {
    return {
      ...new CustomerRegistration(),
      id: this.editForm.get(['id'])!.value,
      applicationNumber: this.editForm.get(['applicationNumber'])!.value,
      registrationNumber: this.editForm.get(['registrationNumber'])!.value,
      applicationDate: this.editForm.get(['applicationDate'])!.value,
      registrationDate: this.editForm.get(['registrationDate'])!.value,
      totalArea: this.editForm.get(['totalArea'])!.value,
      monthlyRate: this.editForm.get(['monthlyRate'])!.value,
      customerType: this.editForm.get(['customerType'])!.value,
      shopName: this.editForm.get(['shopName'])!.value,
      serviceChargeId: this.editForm.get(['serviceChargeId'])!.value,
      serviceChargeName: this.editForm.get(['serviceChargeName'])!.value,
      electricityTypeId: this.editForm.get(['electricityTypeId'])!.value,
      electricityTypeName: this.editForm.get(['electricityTypeName'])!.value,
      advanceAmount: this.editForm.get(['advanceAmount'])!.value,
      depositAmount: this.editForm.get(['depositAmount'])!.value,
      paymentType: this.editForm.get(['paymentType'])!.value,
      advancementTillDate: this.editForm.get(['advancementTillDate'])!.value
        ? moment(this.editForm.get(['advancementTillDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      currentUnit: this.editForm.get(['currentUnit'])!.value,
      rate: this.editForm.get(['rate'])!.value,
      electricityMeterNumber: this.editForm.get(['electricityMeterNumber'])!.value,
      electricityMeterType: this.editForm.get(['electricityMeterType'])!.value,
      itemMeterNumber: this.editForm.get(['itemMeterNumber'])!.value,
      bankNumber: this.editForm.get(['bankNumber'])!.value,
      chequeNumber: this.editForm.get(['chequeNumber'])!.value,
      itemId: this.editForm.get(['itemId'])!.value,
      itemRateName: this.editForm.get(['itemRateName'])!.value,
      // enteredById: this.editForm.get(['enteredById'])!.value,
      enteredByLogin: this.editForm.get(['enteredByLogin'])!.value,
      // approvedById: this.editForm.get(['approvedById'])!.value,
      approvedByLogin: this.editForm.get(['approvedByLogin'])!.value,
      businessTypeId: this.editForm.get(['businessTypeId'])!.value,
      businessTypeName: this.editForm.get(['businessTypeName'])!.value,
      customerId: this.editForm.get(['customerId'])!.value,
      customerN: this.editForm.get(['customerN'])!.value,
      // enteredDate: this.editForm.get(['enteredDate'])!.value
      //   ? moment(this.editForm.get(['enteredDate'])!.value, DATE_TIME_FORMAT)
      //   : undefined,
      // approvedDate: this.editForm.get(['approvedDate'])!.value
      //   ? moment(this.editForm.get(['approvedDate'])!.value, DATE_TIME_FORMAT)
      //   : undefined,
      customerShutters: this.editForm.get(['customerShutters'])!.value,
      discountPolicies: this.editForm.get(['discountPolicies'])!.value,
      createdDate: this.editForm.get(['createdDate'])!.value
        ? moment(this.editForm.get(['createdDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      updatedDate: this.editForm.get(['updatedDate'])!.value
        ? moment(this.editForm.get(['updatedDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      deleted: this.editForm.get(['deleted'])!.value,
      insertedBy: this.editForm.get(['insertedBy'])!.value,
      insertedById: this.editForm.get(['insertedById'])!.value,
      updatedBy: this.editForm.get(['updatedBy'])!.value,
      updatedById: this.editForm.get(['updatedById'])!.value,
      status: this.editForm.get(['status'])!.value,
      monthlyRent: this.editForm.get(['monthlyRent'])!.value,
      showShutter: this.editForm.get(['showShutter'])!.value,
      showElectricity: this.editForm.get(['showElectricity'])!.value,
      showPolicy: this.editForm.get(['showPolicy'])!.value,
      floorId: this.editForm.get(['floorId'])!.value,
      electricityFromUnit: this.editForm.get(['electricityFromUnit'])!.value,
      electricityToUnit: this.editForm.get(['electricityToUnit'])!.value,
      rentOpeningBalance: this.editForm.get(['rentOpeningBalance'])!.value,
      electricityOpeningBalance: this.editForm.get(['electricityOpeningBalance'])!.value,
      serviceOpeningBalance: this.editForm.get(['serviceOpeningBalance'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICustomerRegistration>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  protected parse(customerRegistration: ICustomerRegistration): ICustomerRegistration {
    const copy: ICustomerRegistration = Object.assign({}, customerRegistration, {
      createdDate:
        customerRegistration.createdDate && customerRegistration.createdDate.isValid()
          ? customerRegistration.createdDate.format(DATE_FORMAT)
          : undefined,
      updatedDate:
        customerRegistration.updatedDate && customerRegistration.updatedDate.isValid()
          ? customerRegistration.updatedDate.format(DATE_FORMAT)
          : undefined,
    });
    return copy;
  }
}
