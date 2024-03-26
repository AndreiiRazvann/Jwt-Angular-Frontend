import { NgModule } from '@angular/core';
import { NotifierOptions, NotifierModule } from 'angular-notifier';

const customNotifierOptions: NotifierOptions = { //instead of doing this in app.module, we are creating a separate module and doing it here.
    position: {
          horizontal: {
              position: 'left',
              distance: 150
          },
          vertical: {
              position: 'top',
              distance: 12,
              gap: 10
          }
      },
    theme: 'material',
    behaviour: {
      autoHide: 5000,
      onClick: 'hide',
      onMouseover: 'pauseAutoHide',
      showDismissButton: true,
      stacking: 4
    },
    animations: {
      enabled: true,
      show: {
        preset: 'slide',
        speed: 300,
        easing: 'ease'
      },
      hide: {
        preset: 'fade',
        speed: 300,
        easing: 'ease',
        offset: 50
      },
      shift: {
        speed: 300,
        easing: 'ease'
      },
      overlap: 150
    }
  };

@NgModule({
  imports: [NotifierModule.withConfig(customNotifierOptions)],
  exports: [NotifierModule]
})
export class NotificationModule {}
