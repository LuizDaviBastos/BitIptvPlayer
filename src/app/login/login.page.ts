import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';
  isLoading = false;

  predefinedEmail: string = 'teste@exemplo.com';  
  predefinedPassword: string = '123';    

  constructor(
    private router: Router,
    private toastController: ToastController 
  ) { }

  async login() {
    this.isLoading = true;  

    if (this.email === this.predefinedEmail && this.password === this.predefinedPassword) {
      const toast = await this.toastController.create({
        message: 'Login bem-sucedido',
        duration: 2000,
        position: 'top', 
        color: 'success' 
      });
      toast.present(); 
      console.log("Login bem-sucedido");
      this.router.navigate(['/home']); 
    } else {
    
      const toast = await this.toastController.create({
        message: 'Email ou senha incorretos',
        duration: 2000,
        position: 'top',
        color: 'danger' 
      });
      toast.present(); 
      console.log('Erro no login');
    }

   
    setTimeout(() => {
      this.isLoading = false;
    }, 2000); 
  }

  ngOnInit() {
  }
}
