package com.chaoxing.gsd.modules.entity;

public class GsdLib {
    private String libid;

    private String categoryid;

    private String selfcategoryname;

    private String namecha;

    private String nameeng;

    private Integer type;

    private String wiki;

    public String getLibid() {
        return libid;
    }

    public void setLibid(String libid) {
        this.libid = libid == null ? null : libid.trim();
    }

    public String getCategoryid() {
        return categoryid;
    }

    public void setCategoryid(String categoryid) {
        this.categoryid = categoryid == null ? null : categoryid.trim();
    }

    public String getSelfcategoryname() {
        return selfcategoryname;
    }

    public void setSelfcategoryname(String selfcategoryname) {
        this.selfcategoryname = selfcategoryname == null ? null : selfcategoryname.trim();
    }

    public String getNamecha() {
        return namecha;
    }

    public void setNamecha(String namecha) {
        this.namecha = namecha == null ? null : namecha.trim();
    }

    public String getNameeng() {
        return nameeng;
    }

    public void setNameeng(String nameeng) {
        this.nameeng = nameeng == null ? null : nameeng.trim();
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public String getWiki() {
        return wiki;
    }

    public void setWiki(String wiki) {
        this.wiki = wiki == null ? null : wiki.trim();
    }
}