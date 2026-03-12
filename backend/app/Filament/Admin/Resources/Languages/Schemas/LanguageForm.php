<?php

namespace App\Filament\Admin\Resources\Languages\Schemas;

use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;

class LanguageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                // ── Identity ──────────────────────────────────────────────
                Section::make('Identity')
                    ->columns(2)
                    ->schema([
                        TextInput::make('sym')
                            ->label('Symbol')
                            ->required()
                            ->maxLength(4)
                            ->hint('e.g. Py, Rs, Js'),

                        TextInput::make('name')
                            ->required()
                            ->maxLength(60),

                        Select::make('cat')
                            ->label('Category')
                            ->required()
                            ->options([
                                'systems'    => 'Systems',
                                'scripting'  => 'Scripting',
                                'oop'        => 'OOP',
                                'functional' => 'Functional',
                                'web'        => 'Web',
                                'scientific' => 'Scientific',
                                'esoteric'   => 'Esoteric',
                                'logic'      => 'Logic',
                                'general'    => 'General',
                                'hardware'   => 'Hardware',
                            ]),

                        TextInput::make('year')
                            ->required()
                            ->numeric()
                            ->minValue(1940)
                            ->maxValue(2030),

                        TextInput::make('paradigm')
                            ->required()
                            ->columnSpanFull()
                            ->hint('e.g. Imperative · Procedural · Structured'),

                        Textarea::make('desc')
                            ->label('Description')
                            ->required()
                            ->rows(4)
                            ->columnSpanFull(),
                    ]),

                // ── Tabs ───────────────────────────────────────────────────
                Tabs::make('Details')
                    ->tabs([

                        Tab::make('Links')
                            ->schema([
                                KeyValue::make('links')
                                    ->label('')
                                    ->keyLabel('Key')
                                    ->valueLabel('URL')
                                    ->addActionLabel('Add link')
                                    ->hint('Keys: official, wiki, docs, github, playground, spec, reddit'),
                            ]),

                        Tab::make('Tutorials')
                            ->schema([
                                Repeater::make('tutorials')
                                    ->label('')
                                    ->schema([
                                        TextInput::make('name')->required(),
                                        TextInput::make('url')->required()->url(),
                                    ])
                                    ->columns(2)
                                    ->addActionLabel('Add tutorial')
                                    ->collapsible(),
                            ]),

                        Tab::make('Frameworks')
                            ->schema([
                                Repeater::make('frameworks')
                                    ->label('')
                                    ->schema([
                                        TextInput::make('name')->required(),
                                        TextInput::make('url')->required()->url(),
                                        TextInput::make('desc')->label('Description'),
                                    ])
                                    ->columns(3)
                                    ->addActionLabel('Add framework')
                                    ->collapsible(),
                            ]),

                        Tab::make('Tools')
                            ->schema([
                                Repeater::make('tools')
                                    ->label('')
                                    ->schema([
                                        TextInput::make('name')->required(),
                                        TextInput::make('url')->required()->url(),
                                        TextInput::make('desc')->label('Description'),
                                    ])
                                    ->columns(3)
                                    ->addActionLabel('Add tool')
                                    ->collapsible(),
                            ]),

                        Tab::make('Packages')
                            ->schema([
                                Repeater::make('packages')
                                    ->label('')
                                    ->schema([
                                        TextInput::make('name')->required(),
                                        TextInput::make('url')->required()->url(),
                                        TextInput::make('desc')->label('Description'),
                                    ])
                                    ->columns(3)
                                    ->addActionLabel('Add package')
                                    ->collapsible(),
                            ]),

                        Tab::make('Package Manager')
                            ->schema([
                                KeyValue::make('package_manager')
                                    ->label('')
                                    ->keyLabel('Key')
                                    ->valueLabel('Value')
                                    ->addActionLabel('Set package manager')
                                    ->hint('Keys: name, url'),
                            ]),

                    ]),
            ]);
    }
}
