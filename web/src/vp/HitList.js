class HitList {
  constructor(x,y) {
    this.x = x; this.y = y;
    this.hits = []; // { gad: Gadget, dist: number }
  }
  sortHits() {
    var hits = [];
    while (this.hits.length > 0) {
      var best = 0, d = this.hits[0].dist, i, bz = this.hits[0].gad.z? this.hits[0].gad.z: 0, z;
      for (i = 0; i < this.hits.length && (z = this.hits[i].gad.z? this.hits[i].gad.z: 0, 1); i++)
        if (z > bz || (z == bz && this.hits[i].dist < d)) { best = i; d = this.hits[i].dist; bz = z; }
      hits.push(this.hits[best]); this.hits.splice(best, 1);
    }
    this.hits = hits;
  }
  containsAny(actionFlags) {
    for (var i=0; i<this.hits.length; i++) {
      if ((this.hits[i].gad.actionFlags & actionFlags) != 0) return true;
    }
    return false;
  }
  getActionableGads(actionFlags) {
    var gads = [];
    for (var i=0; i<this.hits.length; i++) {
      if ((this.hits[i].gad.actionFlags & actionFlags) != 0) gads.splice(gads.length, 0, this.hits[i].gad);
    }
    return gads;
  }
  click() {
    for (var i=0; i<this.hits.length; i++) {
      if ((this.hits[i].gad.actionFlags & vp.GAF_CLICKABLE) != 0 && this.hits[i].gad.click)
        this.hits[i].gad.click.call(this.hits[i].gad);
    }
  }
  menu() {
    for (var i=0; i<this.hits.length; i++) {
      if ((this.hits[i].gad.actionFlags & vp.GAF_CONTEXTMENU) != 0 && this.hits[i].gad.menu)
        this.hits[i].gad.menu.call(this.hits[i].gad);
    }
  }
}
