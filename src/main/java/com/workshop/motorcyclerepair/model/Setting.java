package com.workshop.motorcyclerepair.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "setting")
@Setter
@Getter
@ToString
public class Setting {

    @Id
    @Column(name = "key")
    private String key;

    @Column(name = "value")
    private String value;

}
