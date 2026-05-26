import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DenunciaService } from '../../services/denuncia.service';
import { AcuseRecibo } from '../../models/denuncia.model';

@Component({
  selector: 'app-acuse-recibo',
  templateUrl: './acuse-recibo.component.html',
  styleUrls: ['./acuse-recibo.component.scss']
})
export class AcuseReciboComponent implements OnInit {
  acuseRecibo: AcuseRecibo | null = null;
  cargando = true;

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
        // Si no hay acuse, redirigir a crear denuncia
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
    if (this.acuseRecibo) {
      navigator.clipboard.writeText(this.acuseRecibo.folio);
      alert('Folio copiado al portapapeles');
    }
  }

  irAConsultar(): void {
    this.router.navigate(['/denuncias/consultar']);
  }
}