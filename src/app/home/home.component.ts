import { Component, OnInit } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';

import {  Observable } from 'rxjs';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import * as firebase from 'firebase';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  itemList: AngularFireList<any>;
  itemArray = [];

  uploadPercent: Observable<number>;
  ref: AngularFireStorageReference;

  title = '';
  description = '';

  ready:boolean=false;
  v_prog:boolean=false;
  items:any;


  data = {
    ntitle: '',
    ndescription: '',
    nimg: '',
  };

 constructor(private afstorage: AngularFireStorage , public db: AngularFireDatabase) {



}
  ngOnInit() {

    this.itemList = this.db.list('/news');
    this.itemList.snapshotChanges().subscribe(actions => {
      actions.forEach(action => {
        const y = action.payload.toJSON();
        y['$key'] = action.key;

        this.itemArray.push(y as ListItemClass);
      });
    });
    this.itemArray=this.itemArray.slice().reverse();
  }


current_key:string;
  update(title,description){
console.log(this.imageURL)
    this.itemList.set(this.current_key , {
      title :  title ,
      description :  description ,
      img : this.imageURL,
    });
    location.reload();
  }

// tslint:disable-next-line: member-ordering
  ctitle = ' ';
  cdescription = '';
  cimg = '';
  asin(key,item){

    this.ctitle=item.title;
    this.cdescription=item.description;
    this.cimg=item.img;

    this.current_key=key;
  }



onDelete($key) {
  this.itemList.remove($key);
   this.itemArray = [];
  }

  setting_show:boolean=false;
  setting_menu(){
    if(this.setting_show==false){
      this.setting_show=true;
    }else{
      this.setting_show=false;
    }

  }


  file: any;
  fileName: any;
  imageURL = 'null';

  fileEvent_name( event) {
    this.file = event.target.files[0];
    this.fileName = this.file.name;
  }

  upload(event) {
    this.v_prog=true;
    const id = this.fileName;
    const file = event.target.files[0];
    this.ref = this.afstorage.ref(id);
    const task = this.afstorage.upload(id, file);
    this.uploadPercent = task.percentageChanges();
    this.afstorage.upload(id, event.target.files[0]).then(() => {
      this.v_prog=false;
      this.ready=true;
      this.ref.getDownloadURL().subscribe(urls => {
      if (urls) {
        this.imageURL = urls;
        this.cimg=urls;
      }
      });
    });

  }

  addurl(tit,desc) {

    console.log('' + tit + '     ' + desc );
    this.itemList.push({
      img: this.imageURL,
      title: this.data.ntitle,
      description: this.data.ndescription,
      date: firebase.database.ServerValue.TIMESTAMP
    }).then(()=>{
      location.reload();
    });
    console.log(this.imageURL + ' ' + this.data.ntitle + ' ' + this.data.ndescription);
  }

}


export class ListItemClass {
  $key: string;
  title: string;
  img: string;
  description: string;

}
