package com.chaoxing.gsd.modules.entity;

import java.util.Date;

public class LiteratureDetail {
    private String literatureid;

    private Date createtime;

    private String content;

    public String getLiteratureid() {
        return literatureid;
    }

    public void setLiteratureid(String literatureid) {
        this.literatureid = literatureid == null ? null : literatureid.trim();
    }

    public Date getCreatetime() {
        return createtime;
    }

    public void setCreatetime(Date createtime) {
        this.createtime = createtime;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content == null ? null : content.trim();
    }
}