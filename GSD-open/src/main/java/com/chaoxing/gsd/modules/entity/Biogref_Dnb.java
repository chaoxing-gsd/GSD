package com.chaoxing.gsd.modules.entity;

public class Biogref_Dnb {
    private String personId;

    private String personName;

    private String bornYear;

    private String diedYear;

    private String gender;

    private String dynasty;

    private String jiguan;

    private String shengfen;

    private String shiqu;

    private String lonLat;

    private String typeid;

    private String libid;

    public String getPersonId() {
        return personId;
    }

    public void setPersonId(String personId) {
        this.personId = personId == null ? null : personId.trim();
    }

    public String getPersonName() {
        return personName;
    }

    public void setPersonName(String personName) {
        this.personName = personName == null ? null : personName.trim();
    }

    public String getBornYear() {
        return bornYear;
    }

    public void setBornYear(String bornYear) {
        this.bornYear = bornYear == null ? null : bornYear.trim();
    }

    public String getDiedYear() {
        return diedYear;
    }

    public void setDiedYear(String diedYear) {
        this.diedYear = diedYear == null ? null : diedYear.trim();
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender == null ? null : gender.trim();
    }

    public String getDynasty() {
        return dynasty;
    }

    public void setDynasty(String dynasty) {
        this.dynasty = dynasty == null ? null : dynasty.trim();
    }

    public String getJiguan() {
        return jiguan;
    }

    public void setJiguan(String jiguan) {
        this.jiguan = jiguan == null ? null : jiguan.trim();
    }

    public String getShengfen() {
        return shengfen;
    }

    public void setShengfen(String shengfen) {
        this.shengfen = shengfen == null ? null : shengfen.trim();
    }

    public String getShiqu() {
        return shiqu;
    }

    public void setShiqu(String shiqu) {
        this.shiqu = shiqu == null ? null : shiqu.trim();
    }

    public String getLonLat() {
        return lonLat;
    }

    public void setLonLat(String lonLat) {
        this.lonLat = lonLat == null ? null : lonLat.trim();
    }

    public String getTypeid() {
        return typeid;
    }

    public void setTypeid(String typeid) {
        this.typeid = typeid == null ? null : typeid.trim();
    }

    public String getLibid() {
        return libid;
    }

    public void setLibid(String libid) {
        this.libid = libid == null ? null : libid.trim();
    }
}