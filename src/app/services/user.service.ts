import { Injectable } from "@angular/core";
import { doc, Firestore, addDoc, collection, docData, setDoc, query, CollectionReference, getDocs, collectionData } from "@angular/fire/firestore";

import { IUser } from "../interfaces/user.interface";
import { BehaviorSubject, combineLatest, first, map, Observable, } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly COLLECTION_NAME = "users";
  private collection: CollectionReference
  constructor(private firestore: Firestore) { 
    this.collection = collection(this.firestore, this.COLLECTION_NAME);
  }

  add(user: IUser) {
    try {
      return setDoc(doc(this.collection, user.id), user)
    } catch (error) { return null }
  }

  getById(id: string): Observable<IUser> {
    const noteDocRef = doc(this.firestore, `${this.COLLECTION_NAME}/${id}`)
    return docData(noteDocRef, {idField: 'id'}).pipe(first()) as Observable<IUser>
  }
}
