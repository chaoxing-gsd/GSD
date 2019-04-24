package com.chaoxing.gsd.modules.entity;

public class GsdIndex {
    private Integer id;

    private String name;

    private String domainname;

    private String tel;

    private String email;

    private String wiki;

    private String message;

    private String updatetype;

    private String userid;

    private Boolean update;

    private String csvurl;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public String getDomainname() {
        return domainname;
    }

    public void setDomainname(String domainname) {
        this.domainname = domainname == null ? null : domainname.trim();
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel == null ? null : tel.trim();
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email == null ? null : email.trim();
    }

    public String getWiki() {
        return wiki;
    }

    public void setWiki(String wiki) {
        this.wiki = wiki == null ? null : wiki.trim();
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message == null ? null : message.trim();
    }

    public String getUpdatetype() {
        return updatetype;
    }

    public void setUpdatetype(String updatetype) {
        this.updatetype = updatetype == null ? null : updatetype.trim();
    }

    public String getUserid() {
        return userid;
    }

    public void setUserid(String userid) {
        this.userid = userid == null ? null : userid.trim();
    }

    public Boolean getUpdate() {
        return update;
    }

    public void setUpdate(Boolean update) {
        this.update = update;
    }

    public String getCsvurl() {
        return csvurl;
    }

    public void setCsvurl(String csvurl) {
        this.csvurl = csvurl == null ? null : csvurl.trim();
    }
}