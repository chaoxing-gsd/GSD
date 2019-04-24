package com.chaoxing.gsd.modules.entity;

import java.util.Date;
/**
 * 用户账户
 * @author winsl
 *
 */
public class Users {
    private Integer id;

    private String email;

    private String name;

    private String password;

    private Date created;

    private Date updated;

    private Date deleted;

    private Integer level;

    private Integer referfriend;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email == null ? null : email.trim();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password == null ? null : password.trim();
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public Date getUpdated() {
        return updated;
    }

    public void setUpdated(Date updated) {
        this.updated = updated;
    }

    public Date getDeleted() {
        return deleted;
    }

    public void setDeleted(Date deleted) {
        this.deleted = deleted;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public Integer getReferfriend() {
        return referfriend;
    }

    public void setReferfriend(Integer referfriend) {
        this.referfriend = referfriend;
    }
}