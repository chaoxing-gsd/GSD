package com.chaoxing.gsd.modules.entity;
/**
 * 对应表literature_comp_lib_filed
 * @author winsl
 *
 */
public class LiteratureCompLibFiled {
    private Integer id;

    private String libid;

    private String filedid;

    private String filednamecn;

    private String filednameen;
    
    private Integer orderlist;

    public Integer getOrder() {
		return orderlist;
	}

	public void setOrder(Integer order) {
		this.orderlist = order;
	}

	public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getLibid() {
        return libid;
    }

    public void setLibid(String libid) {
        this.libid = libid == null ? null : libid.trim();
    }

    public String getFiledid() {
        return filedid;
    }

    public void setFiledid(String filedid) {
        this.filedid = filedid == null ? null : filedid.trim();
    }

    public String getFilednamecn() {
        return filednamecn;
    }

    public void setFilednamecn(String filednamecn) {
        this.filednamecn = filednamecn == null ? null : filednamecn.trim();
    }

    public String getFilednameen() {
        return filednameen;
    }

    public void setFilednameen(String filednameen) {
        this.filednameen = filednameen == null ? null : filednameen.trim();
    }
}