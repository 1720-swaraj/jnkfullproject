package com.example.JanlokPom.service;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        // IMAGE ACCESS
        registry.addResourceHandler("/images/**")
                .addResourceLocations(
                        "file:" +
                                System.getProperty("user.dir")
                                + "/images/"
                );

        // DOWNLOAD FILE ACCESS
        registry.addResourceHandler("/downloads/**")
                .addResourceLocations(
                        "file:" +
                                System.getProperty("user.dir")
                                + "/uploads/downloads/"
                );
    }
}