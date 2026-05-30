import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DenunciaService } from '../../services/denuncia.service';
import { AcuseRecibo } from '../../models/denuncia.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-acuse-recibo',
  templateUrl: './acuse-recibo.component.html',
  styleUrls: ['./acuse-recibo.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class AcuseReciboComponent implements OnInit {
  acuseRecibo: AcuseRecibo | null = null;
  cargando = true;
  contrasenaCopida = false;
  folioCopido = false;

  constructor(
    private denunciaService: DenunciaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.denunciaService.getUltimoAcuseRecibo().subscribe(acuse => {
      if (acuse) {
        this.acuseRecibo = acuse;
        this.cargando = false;
      } else {
        setTimeout(() => {
          this.router.navigate(['/denuncias/crear']);
        }, 2000);
      }
    });
  }

  descargarAcuse(): void {
    if (!this.acuseRecibo) return;

    const contenido = `
ACUSE DE RECIBO DE DENUNCIA
===========================
Folio: ${this.acuseRecibo.folio}
Fecha de Recepción: ${this.acuseRecibo.fecha_recibida}
Asunto: ${this.acuseRecibo.titulo_denuncia}
Estado: ${this.acuseRecibo.estado}

CONTRASEÑA DE ACCESO: ${this.acuseRecibo.contrasena_acceso}
(Guarda esta contraseña en un lugar seguro. La necesitarás para consultar tu denuncia.)

Próximos Pasos:
${this.acuseRecibo.proximos_pasos.map((paso, i) => `${i + 1}. ${paso}`).join('\n')}

---
Guarda este documento como referencia de tu denuncia.
    `;

    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `acuse-${this.acuseRecibo.folio}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  copiarFolio(): void {
    if (!this.acuseRecibo) return;
    navigator.clipboard.writeText(this.acuseRecibo.folio).then(() => {
      this.folioCopido = true;
      setTimeout(() => (this.folioCopido = false), 2000);
    });
  }

  copiarContrasena(): void {
    if (!this.acuseRecibo) return;
    navigator.clipboard.writeText(this.acuseRecibo.contrasena_acceso).then(() => {
      this.contrasenaCopida = true;
      setTimeout(() => (this.contrasenaCopida = false), 2000);
    });
  }

  irAConsultar(): void {
    this.router.navigate(['/denuncias/consultar']);
  }
}
