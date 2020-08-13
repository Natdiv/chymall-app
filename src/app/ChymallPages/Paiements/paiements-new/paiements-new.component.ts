import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CrudService} from '../../../ChymallServices/crud/crud.service';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-paiements-new',
  templateUrl: './paiements-new.component.html',
  styleUrls: ['./paiements-new.component.sass']
})
export class PaiementsNewComponent implements OnInit {

  newPaiementForm: FormGroup;
  closeResult: string;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private modalService: NgbModal,
              private crudService: CrudService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.initForm();
  }

    open(content) {
        this.modalService.open(content,
            {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult =
                `Dismissed ${this.getDismissReason(reason)}`;
        });
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

    openLarge(content) {
        this.modalService.open(content, {
            size: 'lg'
        });
    }

  initForm() {
    this.newPaiementForm = this.formBuilder.group({
      inscription: ['', [Validators.required]],
      trading: ['', [Validators.required]]
    });
  }
  newPaiement() {

      const m_inscription = this.newPaiementForm.get('inscription').value;
      const m_trading = this.newPaiementForm.get('trading').value;

      let f_inscription = (m_inscription * 15) / 100;
      let f_trading = (m_trading.montant * 15) / 100;

      const paiement = {
       id_profile: 1,
       montant_inscription: m_inscription,
       montant_trading: m_trading,
       frais_inscription: f_inscription,
       frais_trading: f_trading,
       date_operation: null
    };
      this.crudService.addPaiement(paiement).subscribe(
        (reponse: any) => {
          if (reponse.status === true) {
            this.modalService.open('Paiement effectué avec succès');
            this.newPaiementForm.reset();
          } else {
              this.modalService.open('Paiement a échoué');
          }
        }
    );

  }

}
