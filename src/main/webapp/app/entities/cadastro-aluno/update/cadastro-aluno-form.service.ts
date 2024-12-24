import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICadastroAluno, NewCadastroAluno } from '../cadastro-aluno.model';

@Injectable({
  providedIn: 'root',
})
export class CadastroAlunoFormService {
  constructor(private fb: FormBuilder) {}

  /**
   * Cria um formulário reativo com base nos dados de um aluno existente
   * ou inicializa um formulário vazio para um novo cadastro.
   */
  createCadastroAlunoFormGroup(cadastroAluno: ICadastroAluno | null = null): FormGroup {
    return this.fb.group({
      id: [{ value: cadastroAluno?.id || null, disabled: true }], // Campo desabilitado para edição
      nome: [cadastroAluno?.nome || '', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      dataNascimento: [cadastroAluno?.dataNascimento || '', [Validators.required]],
      cpf: [cadastroAluno?.cpf || '', [Validators.required, Validators.pattern(/^\d{11}$/)]], // CPF com 11 dígitos
      email: [cadastroAluno?.email || '', [Validators.required, Validators.email]],
      telefone: [cadastroAluno?.telefone || '', [Validators.pattern(/^\d{10,11}$/)]], // Telefone com 10 ou 11 dígitos
    });
  }

  /**
   * Converte os dados de um FormGroup em um objeto `ICadastroAluno`.
   */
  getCadastroAlunoFromForm(form: FormGroup): ICadastroAluno | NewCadastroAluno {
    return {
      id: form.get(['id'])!.value,
      nome: form.get(['nome'])!.value,
      dataNascimento: form.get(['dataNascimento'])!.value,
      cpf: form.get(['cpf'])!.value,
      email: form.get(['email'])!.value,
      telefone: form.get(['telefone'])!.value,
    };
  }

  /**
   * Atualiza os campos do formulário com base em um objeto `ICadastroAluno`.
   */
  resetForm(form: FormGroup, cadastroAluno: ICadastroAluno | null): void {
    form.reset({
      id: { value: cadastroAluno?.id || null, disabled: true }, // Campo de ID desabilitado
      nome: cadastroAluno?.nome || '',
      dataNascimento: cadastroAluno?.dataNascimento || '',
      cpf: cadastroAluno?.cpf || '',
      email: cadastroAluno?.email || '',
      telefone: cadastroAluno?.telefone || '',
    });
  }
}
