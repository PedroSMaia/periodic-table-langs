<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLanguageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $languageId = $this->route('language')?->id;

        return [
            'sym'             => ['sometimes', 'required', 'string', 'max:4', "unique:languages,sym,{$languageId}"],
            'name'            => ['sometimes', 'required', 'string', 'max:60', "unique:languages,name,{$languageId}"],
            'cat'             => ['sometimes', 'required', 'string', 'in:systems,scripting,oop,functional,web,scientific,esoteric,logic,general,hardware'],
            'year'            => ['sometimes', 'required', 'integer', 'min:1940', 'max:2030'],
            'paradigm'        => ['sometimes', 'required', 'string', 'max:255'],
            'desc'            => ['sometimes', 'required', 'string'],
            'links'           => ['nullable', 'array'],
            'links.*'         => ['nullable', 'url'],
            'tutorials'       => ['nullable', 'array'],
            'tutorials.*.name'=> ['required_with:tutorials', 'string'],
            'tutorials.*.url' => ['required_with:tutorials', 'url'],
            'frameworks'      => ['nullable', 'array'],
            'frameworks.*.name' => ['required_with:frameworks', 'string'],
            'frameworks.*.url'  => ['required_with:frameworks', 'url'],
            'frameworks.*.desc' => ['nullable', 'string'],
            'tools'           => ['nullable', 'array'],
            'tools.*.name'    => ['required_with:tools', 'string'],
            'tools.*.url'     => ['required_with:tools', 'url'],
            'tools.*.desc'    => ['nullable', 'string'],
            'packages'        => ['nullable', 'array'],
            'packages.*.name' => ['required_with:packages', 'string'],
            'packages.*.url'  => ['required_with:packages', 'url'],
            'packages.*.desc' => ['nullable', 'string'],
            'package_manager'         => ['nullable', 'array'],
            'package_manager.name'    => ['required_with:package_manager', 'string'],
            'package_manager.url'     => ['required_with:package_manager', 'url'],
        ];
    }
}
