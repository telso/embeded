import { Component, OnInit, OnChanges } from '@angular/core';
import { PoDialogService } from '@po-ui/ng-components';

@Component({
  selector: 'embedqry',
  templateUrl: './embedqry.component.html'
})
export class EmbedqryComponent implements OnInit ,OnChanges  {

  public advpl = '';
  public alias = '';
  public sql = '';
  public temif = true;
  public chgqry = true;
  public variqry = '';
  public variif = '';
  public linfeed = '';

  private auxvalue = '';
  private exprsql = [];
  private exprchg = [];
  private exprsib = [];
  private str1 = '';
  private str2 = '';
  private aauxif = [];
  private pos = 1;
  private pos2: any = 1;
  private pos3: any = 1;
  private pos4: any = 1;
  private auxif = '';
  private auxif2 = '';
  private newvalue = '';

  constructor(private poDialog: PoDialogService) { }

  ngOnInit(): void {
    this.advpl = 'cQuery := " SELECT A1_CGC, A1_COD, A1_LOJA"+Chr(13)+Chr(10)\n';
    this.advpl += 'cQuery += " FROM "+RetSqlName("SA1")+" SA1 "+Chr(13)+Chr(10)\n';
    this.advpl += 'cQuery += " WHERE A1_FILIAL = '+"'"+'"+xFilial("SA1")+"'+"'"+'"+Chr(13)+Chr(10)\n';
    this.advpl += 'If nCond==1\n';
    this.advpl += '   cQuery += " AND A1_PESSOA = '+"'"+'F'+"'"+'"+Chr(13)+Chr(10)\n';
    this.advpl += 'Else\n';
    this.advpl += '   cQuery += " AND A1_PESSOA = '+"'"+'J'+"'"+'"+Chr(13)+Chr(10)\n';
    this.advpl += 'EndIf\n';
    this.advpl += 'cQuery += " AND SA1.D_E_L_E_T_ ='+"' '"+' "'+'+Chr(13)+Chr(10)\n';
    this.sql = '';
    this.alias = 'cAliastmp';
    this.temif = true;
    this.chgqry = true;
    this.variqry = 'cquery';
    this.variif = 'cwhere';
    this.linfeed = 'CHR(13)+CHR(10)';
  }

  ngOnChanges(): void {}

  copyclipb(){
    this.poDialog.alert({ title: 'Embedded SQL copiado: ', message: this.sql })
  }

  clearfield(){
    this.ngOnInit();
  }

  save() {
    let ctemif = this.temif ? 'Sim' : 'Não';
    let cchgqry = this.chgqry ? 'Sim' : 'Não';
    this.sql = this.convertsql(this.advpl,this.alias,this.variif.toUpperCase(),this.variqry.toUpperCase(),this.linfeed,cchgqry,ctemif);
  }

  convertsql (value: string, alias: string,cwhere: string,cvariif:string,cvariqry:string,chgqry: string,temif: string) {
    this.newvalue ='';
    value.trim();
    this.auxvalue = value.toUpperCase();
    this.exprsql = ["RETSQLNAME","XFILIAL","D_E_L_E_T_","CFILANT","MV_PAR01","MV_PAR02","MV_PAR03",
    "MV_PAR04","MV_PAR05","MV_PAR06","MV_PAR07","MV_PAR08","MV_PAR09","MV_PAR10",
    "MV_PAR11","MV_PAR12","MV_PAR13","MV_PAR14","MV_PAR15","MV_PAR16","MV_PAR17",
    "MV_PAR18","MV_PAR19","MV_PAR20","MV_PAR21","MV_PAR22","MV_PAR23","MV_PAR24",
    "MV_PAR25","->"];
    this.exprchg = ["%table:","%xfilial:","%notdel","%exp:cfilant","%exp:mv_par01","%exp:mv_par02","%exp:mv_par03",
    "%exp:mv_par04","%exp:mv_par05","%exp:mv_par06","%exp:mv_par07","%exp:mv_par08","%exp:mv_par09","%exp:mv_par10",
    "%exp:mv_par11","%exp:mv_par12","%exp:mv_par13","%exp:mv_par14","%exp:mv_par15","%exp:mv_par16","%exp:mv_par17",
    "%exp:mv_par18","%exp:mv_par19","%exp:mv_par20","%exp:mv_par21","%exp:mv_par22","%exp:mv_par23","%exp:mv_par24",
    "%exp:mv_par25","%exp:"];
    this.exprsib = [':=','+=','+',"\""];
    this.pos2 = 1;
    this.auxif = '';

    if (temif === "Sim") {
      this.str1 = '';
      this.aauxif = [];
      this.pos = 1;
      while (this.pos > 0) {
        this.pos = this.auxvalue.indexOf("IF ");
        this.pos2 = this.auxvalue.indexOf("ENDIF")+5;
        if (this.pos > 0) {
          this.str1 = this.auxvalue.substr(this.pos,(this.pos2-this.pos));
          this.auxvalue = this.auxvalue.split(this.str1).join('');
          this.aauxif.push(this.str1);
        }
      }
      this.auxif = '';
      for (let element of this.aauxif ){
        this.auxif += element;
      }

      this.auxif = this.auxif.split(cvariqry).join('');
      this.auxif = this.auxif.split(cvariif).join('');
      for (let element of this.exprsib ){
        this.auxif = this.auxif.split(element.toString()).join('');
      }

      this.aauxif = [];
      this.pos = 1;
      while (this.pos > 0) {
        this.pos = this.auxif.indexOf('\n');
        if (this.pos > 0){
          this.auxif2 = this.auxif.substr(0,this.pos);
          this.pos2 = !(this.auxif2.indexOf("IF ") === -1);
          this.pos3 = !(this.auxif2.indexOf("ELSE") === -1);
          if (this.pos2 || this.pos3) {
            this.aauxif.push(this.auxif2);
          } else {
            this.aauxif.push('    '+cwhere+'+= "'+this.auxif2+'"');
          }
          this.auxif = this.auxif.split((this.auxif2+'\n')).join('');
        } else {
          this.aauxif.push(this.auxif);
        }
      }
      this.newvalue = cwhere+':= "'+'%'+'"'+'\n';
      for (let element of this.aauxif ){
        this.newvalue += element+'\n';
      }
      this.newvalue += cwhere+'+= "'+'%'+'"'+'\n';
    }

    this.auxvalue = this.auxvalue.split(cvariqry).join('');
    this.auxvalue = this.auxvalue.split(cvariif).join('');
    for (let element of this.exprsib ){
      this.auxvalue = this.auxvalue.split(element).join('');
    }

    for (let i = 0; i < (this.exprsql.length); i++) {
      this.pos = this.auxvalue.indexOf(this.exprsql[i]);
      while (this.pos > 0) {
        this.str1 = '';
        this.str2 = '';
        this.pos2 = 0;
        this.pos3 = 0;
        if (this.exprsql[i]=="XFILIAL") {
          this.pos = this.auxvalue.indexOf("'XFILIAL");
          if (this.pos > 0) {
            this.exprsql[i] = "'XFILIAL";
            this.pos2 = this.exprsql[i].length;
            this.str1 = this.auxvalue.substr(this.pos+this.pos2,6);
            this.pos3 = this.str1.indexOf(")");
            this.str2 = this.auxvalue.substr(this.pos+this.pos2,this.pos3);
          } else {
            this.pos = this.auxvalue.indexOf("XFILIAL");
            this.pos2 = this.exprsql[i].length
            this.str1 = this.auxvalue.substr(this.pos+this.pos2,5);
            this.pos3 = this.str1.indexOf(")");
            this.str2 = this.auxvalue.substr(this.pos+this.pos2,this.pos3);
          }
        } else if (this.exprsql[i]=="RETSQLNAME") {
          this.pos2 = this.exprsql[i].length;
          this.str1 = this.auxvalue.substr(this.pos+this.pos2,5);
          this.pos3 = this.str1.indexOf(")");
          this.str2 = this.auxvalue.substr(this.pos+this.pos2,this.pos3);
        } else if (this.exprsql[i]=="D_E_L_E_T_") {
          this.pos2 = this.exprsql[i].length;
          this.pos3 = this.auxvalue.indexOf("*",(this.pos+this.pos2));
          if (this.pos3==-1){
            this.pos3 = this.auxvalue.indexOf("'",(this.pos+this.pos2));
            this.pos3 += 3;
          } else {
            this.pos3 += 2;
          }
          this.pos4 = (this.pos3-(this.pos+this.pos2));
          this.str1 = this.auxvalue.substr(this.pos+this.pos2,this.pos4);
          this.str2 = '';
        } else if (this.exprsql[i]=="->") {
          this.pos -= 3;
          this.str1 = this.auxvalue.substr(this.pos,15);
          this.pos3 = this.str1.indexOf(" ");
          this.str2 = this.auxvalue.substr(this.pos,this.pos3);
          this.str1 = this.str2;
        }
        this.str2 = this.str2.split(' ').join('');
        this.str2 = this.str2.split('(').join('');
        this.str2 = this.str2.split(')').join('');
        this.auxvalue = this.auxvalue.split(this.exprsql[i]+this.str1).join(this.exprchg[i]+this.str2+'%');

        this.pos = this.auxvalue.indexOf(this.exprsql[i]);
      }
    }
    this.newvalue += alias+' := GetNextAlias()\n';
    this.newvalue += 'BeginSql ALIAS '+alias+'\n';
    if (chgqry === 'Não') {
      this.newvalue += '   %noparser%\n';
    }
    this.newvalue += this.auxvalue;
    if (temif === 'Sim') {
      this.newvalue += '\n   %exp:'+cwhere+'%\n';
    }
    this.newvalue += '\nEndSql';
    this.newvalue = this.newvalue.split('\n\n').join('\n'); //pesquisa-limpa enter duplo
    this.newvalue = this.newvalue.split('\n\n\n').join('\n'); //pesquisa-limpa enter tripo
  return this.newvalue;
  }

}
