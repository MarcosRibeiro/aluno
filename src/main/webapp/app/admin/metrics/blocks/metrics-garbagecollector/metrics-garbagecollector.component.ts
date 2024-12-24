import { Component, input } from '@angular/core';

import CadastroAlunoModule from 'app/shared/shared.module';
import { GarbageCollector } from 'app/admin/metrics/metrics.model';

@Component({
  standalone: true,
  selector: 'jhi-metrics-garbagecollector',
  templateUrl: './metrics-garbagecollector.component.html',
  imports: [CadastroAlunoModule],
})
export class MetricsGarbageCollectorComponent {
  /**
   * object containing garbage collector related metrics
   */
  garbageCollectorMetrics = input<GarbageCollector>();

  /**
   * boolean field saying if the metrics are in the process of being updated
   */
  updating = input<boolean>();
}
