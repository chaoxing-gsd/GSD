package com.chaoxing.gsd.modules.entity;

import java.util.Date;
import java.util.Map;

public class LiteratureCompDetail {
    private Integer labelid;

    private String literatureid;

    private String type;

    private String indexname;
    
    private String jsonbody;

    private Date createtime;
    
    private Map<String, Boolean> filedshow;

    public Map<String, Boolean> getFiledshow() {
		return filedshow;
	}

	public void setFiledshow(Map<String, Boolean> object) {
		this.filedshow = object;
	}

	public String getJsonbody() {
		return jsonbody;
	}

	public void setJsonbody(String jsonbody) {
		this.jsonbody = jsonbody;
	}

	public Integer getLabelid() {
        return labelid;
    }

    public void setLabelid(Integer labelid) {
        this.labelid = labelid;
    }

    public String getLiteratureid() {
        return literatureid;
    }

    public void setLiteratureid(String literatureid) {
        this.literatureid = literatureid == null ? null : literatureid.trim();
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type == null ? null : type.trim();
    }

    public String getIndexname() {
        return indexname;
    }

    public void setIndexname(String indexname) {
        this.indexname = indexname == null ? null : indexname.trim();
    }

    public Date getCreatetime() {
        return createtime;
    }

    public void setCreatetime(Date createtime) {
        this.createtime = createtime;
    }
}