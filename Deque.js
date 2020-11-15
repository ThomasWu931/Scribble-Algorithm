
class Deque{
  constructor(){
    this.front = null;
    this.back = null;
    this.length = 0;
  }
  pushFront(el){
    el = new DequeEl(el);
    this.length++;
    if (this.front == null){
      this.front = el;
      this.back = el;
    }
    else{
      this.front.next = el;
      el.prev = this.front;
      this.front = el;
    }
  }
  popFront(){
    let temp = this.front;
    this.length--;
    this.front = this.front.prev;
    
    if (this.front == null) this.back = null;
    else this.front.next = null;
    
    return temp.val;
  }
  pushBack(el){
    el = new DequeEl(el);
    this.length++;
    
    if (this.back == null){
      this.back = el;
      this.front = el;
    }
    else{
      this.back.prev = el;
      el.next = this.back;
      this.back = el;
    }
  }
  popBack(){
    let temp = this.back;
    this.length--;
    this.back = this.back.next;
    
    if (this.back == null) this.front = null;
    else this.back.prev = null;
    
    return temp.val;
  }
}

class DequeEl{
  constructor(val){
    this.next = null;
    this.prev = null;
    this.val = val;
  }
}
